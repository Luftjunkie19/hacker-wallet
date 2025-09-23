import { ethers } from 'ethers';
import { DropdownMenu } from 'radix-ui';
import React, { useCallback, useEffect, useState } from 'react'
import { RiTokenSwapFill } from 'react-icons/ri';
import useFetchTokensData from '~popup/hooks/useFetchTokensData';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper'
import * as z from 'zod';
import  bcrypt  from 'bcryptjs';
import { erc20Abi } from '~popup/abis/ERC20';
import { erc721Abi } from '~popup/abis/ERC721';
import useFetchNftData from '~popup/hooks/useFetchNftData';
import { Link, redirect } from 'react-router-dom';
import { SiOpensea } from 'react-icons/si';
import { fetchContainingKeywordElements } from '~popup/IndexedDB/WalletDataStorage';
import { MdFastfood } from 'react-icons/md';
import {LuBatteryMedium} from "react-icons/lu";
import {GiSloth} from "react-icons/gi";
import { FaScrewdriverWrench } from 'react-icons/fa6';
import { FaArrowDown } from 'react-icons/fa';
import TransferModal from '~popup/component/modals/TransferModal';

function TransferScreen() {
  const publicAddress= useAppSelector((state)=>state.loggedIn.address);
  const encryptedPrivatKey= useAppSelector((state)=>state.loggedIn.encryptedWallet);
  const passwordOfSession = useAppSelector((state)=>state.loggedIn.password);
  
  const currentNetworkName= useAppSelector((state)=>state.currentNetworkConnected.networkName);
  const currentNetworkChainID= useAppSelector((state)=>state.currentNetworkConnected.chainId);
  const rpcURL=useAppSelector((state)=>state.currentNetworkConnected.rpcURL);
  const {tokens}=useFetchTokensData();
  const {elements:nftElements}=useFetchNftData();

  // Transaction Detail Fields
  const [amountToSend, setAmountToSend]=useState<number>();
  const [erc20Address, setERC20Address]=useState<`0x${string}` | null>();
  const [erc721Address, setERC721Address]=useState<`0x${string}` | null>();
  const [erc721Id, setERC721Id]=useState<BigInt| null>(null);
  const [password, setPassword]=useState<string>();
  const [openModal, setOpenModal]=useState<boolean>(false);
  const [destinationAddress, setDestinationAddress]=useState<`0x${string}`>();
  const [gasFeesOptions, setGasFeesOptions]=useState<any>();
  const [selectedGasOption, setGasOption]=useState<any>();

  const [currentStep, setCurrentStep]=useState<number>(0);
  
 

 

  const sendNftToken = async ()=>{
    try{
    const isValid= await bcrypt.compare(password, passwordOfSession);

    if(!passwordOfSession || !isValid){
alert('Wrong password to validate the transaction !');
return;
    }

    const provider = new ethers.JsonRpcProvider(rpcURL);

    const wallet = await ethers.Wallet.fromEncryptedJson(encryptedPrivatKey, password);

    const walletDecrypted = new ethers.Wallet(wallet.privateKey, provider);
  
    const nftInterface= new ethers.Interface(erc721Abi);

    const nftContract= new ethers.Contract(erc721Address, nftInterface, walletDecrypted);

    const contractAddr= await nftContract.getAddress();
const data = nftContract.interface.encodeFunctionData("safeTransferFrom", [publicAddress, destinationAddress, erc721Id]);
const populatedTransaction:ethers.TransactionRequest = { to: contractAddr,from: publicAddress, data };

    const tx= await walletDecrypted.sendTransaction({...populatedTransaction,
      gasLimit: selectedGasOption.gasLimit,
      maxFeePerGas:selectedGasOption.maxFeePerGas,
      maxPriorityFeePerGas: selectedGasOption.maxPriorityFeePerGas,

    });

    const result = await tx.wait();

    console.log(result);

    }catch(err){
      console.log(err);
    }
  }

  const sendERC20Token = async ()=>{
    try {
      
      const isValid= await bcrypt.compare(password, passwordOfSession);
      
      if(!passwordOfSession || !isValid){
        alert('Wrong password to validate the transaction !');
        return;
      }

      const provider = new ethers.JsonRpcProvider(rpcURL);
      
      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedPrivatKey, password);
      
      const walletDecrypted = new ethers.Wallet(wallet.privateKey, provider);
      
      const erc20Interface= new ethers.Interface(erc20Abi);

      const contract= new ethers.Contract(erc20Address, erc20Interface, walletDecrypted);

      const decimals= await contract.decimals();

    const erc20Contract= new ethers.Contract(erc20Address, erc20Interface, walletDecrypted);

    const contractAddr= await erc20Contract.getAddress();

    const amountToBeSent= BigInt(amountToSend * (10 ** Number(decimals)));

const data = erc20Contract.interface.encodeFunctionData("transferFrom", [publicAddress, destinationAddress, amountToBeSent]);
const populatedTransaction:ethers.TransactionRequest = { to: contractAddr,from: publicAddress, data };

    const tx = await walletDecrypted.sendTransaction({...populatedTransaction,
      gasLimit: selectedGasOption.gasLimit ?? gasFeesOptions.medium.gasLimit,
      maxFeePerGas:selectedGasOption.maxFeePerGas  ?? gasFeesOptions.medium.maxFeePerGas,
      maxPriorityFeePerGas: selectedGasOption.maxPriorityFeePerGas  ?? gasFeesOptions.medium.maxPriorityFeePerGas,
    });



     const result = await tx.wait();

     console.log(result);

      
    } catch (error) {
      console.log(error);
    }

  }

  const handleNativeTokenTransaction =async ()=>{

    if(destinationAddress.length !== 42){
      alert('Invalid Destination Address');
      return;
    }

    try {
       const provider = new ethers.JsonRpcProvider(rpcURL);

    const isValid= await bcrypt.compare(password, passwordOfSession);

    if(!passwordOfSession || !isValid){
alert('Wrong password to validate the transaction !');

    }

    const wallet = await ethers.Wallet.fromEncryptedJson(encryptedPrivatKey, password);

    const walletDecrypted = new ethers.Wallet(wallet.privateKey, provider);


    const tx= await walletDecrypted.sendTransaction({
  from:publicAddress,
  to: destinationAddress,
  value:BigInt(amountToSend * (10**18)),
  'chainId': currentNetworkChainID,
  gasLimit: selectedGasOption.gasLimit ?? gasFeesOptions.medium.gasLimit,
      maxFeePerGas:selectedGasOption.maxFeePerGas  ?? gasFeesOptions.medium.maxFeePerGas,
      maxPriorityFeePerGas: selectedGasOption.maxPriorityFeePerGas  ?? gasFeesOptions.medium.maxPriorityFeePerGas
    });

    const receiptTx= await tx.wait();

    console.log(receiptTx);


      
    } catch (error) {

      console.log(error);
      
    }
      
  };


  const handleFinalTransaction= async ()=>{

    try {

      if(erc721Address && erc721Id){
        await sendNftToken();
      return;
      }

      if(erc20Address){
        await sendERC20Token();
        return;
      }
      
      await handleNativeTokenTransaction();

          redirect('/');


    }catch(err){
      alert(err);
      console.log(err);

    }

  }


  
  return (
    <div
    className='
    plasmo-w-full
    plasmo-flex plasmo-flex-col plasmo-gap-4
    plasmo-h-screen plasmo-overflow-auto
    '
    >
{
  currentStep === 0 &&
  <>
  
  </>
}



{
currentStep === 1 &&
<>
<p
className='plasmo-text-secondary plasmo-font-semibold plasmo-text-lg
'>
  Transaction Summary
</p>


<div className="plasmo-flex plasmo-flex-col gap-2 plasmo-w-full plasmo-items-center plasmo-justify-center">
  <div className="plasmo-bg-accent plasmo-p-2 plasmo-rounded-lg plasmo-w-full">
    <p className='plasmo-text-secondary plasmo-font-semibold plasmo-text-lg'>From</p>
    <p className='plasmo-text-white plasmo-font-light plasmo-line-clamp-1'>{publicAddress}</p>
  </div>
<FaArrowDown/>
<div className="plasmo-bg-accent plasmo-p-2 plasmo-rounded-lg plasmo-w-full">
  <p className='plasmo-text-secondary font-semibold plasmo-text-lg'>To</p>
  <p className='plasmo-text-white plasmo-font-light plasmo-line-clamp-1'>{destinationAddress}</p>
</div>
</div>


<div className="plasmo-bg-accent plasmo-px-2 plasmo-py-4 plasmo-rounded-lg plasmo-text-white plasmo-w-full plasmo-flex plasmo-justify-between plasmo-items-center">
  <p>Network</p>

  <p>{currentNetworkName}</p>
</div>



<div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-full">
<p className='plasmo-text-white'>Speed Of Tranasaction</p>

<div className="plasmo-w-full plasmo-grid plasmo-grid-cols-3 plasmo-items-center plasmo-gap-2">
<button onClick={()=>setGasOption(gasFeesOptions.slow)} className='plasmo-bg-accent plasmo-p-3 plasmo-rounded-lg plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-items-center plasmo-justify-center'>
<p className='plasmo-text-sm plasmo-text-white'>Slow</p>

<GiSloth className='plasmo-text-secondary'/>

</button>

<button onClick={()=>setGasOption(gasFeesOptions.medium)} className='plasmo-bg-accent plasmo-p-3 plasmo-rounded-lg plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-items-center plasmo-justify-center'>
<p className='plasmo-text-sm plasmo-text-white'>Medium</p>
<LuBatteryMedium className='plasmo-text-secondary'/>
</button>

<button onClick={()=>setGasOption(gasFeesOptions.fast)} className='plasmo-bg-accent plasmo-p-3 plasmo-rounded-lg plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-items-center plasmo-justify-center'>
<p className='plasmo-text-sm plasmo-text-white'>Fast</p>
<MdFastfood className='plasmo-text-secondary'/>
</button>

</div>

</div>


<button
onClick={handleFinalTransaction}
className='plasmo-bg-secondary plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'
>
  Send Transaction
</button>
</>
}

      
    </div>
  )
}

export default TransferScreen