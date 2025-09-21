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
  const currentNetworkNativeTokenSymbol= useAppSelector((state)=>state.currentNetworkConnected.currencySymbol);
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
  const [tokenType, setTokenType]=useState<"ERC20" | "NFT">("ERC20");
  const [maxAmountToSend, setMaxAmountToSend]=useState<number>(0);
  const [password, setPassword]=useState<string>();
  const [openModal, setOpenModal]=useState<boolean>(false);
  const [destinationAddress, setDestinationAddress]=useState<`0x${string}`>();
  const [gasFeesOptions, setGasFeesOptions]=useState<any>();
  const [selectedGasOption, setGasOption]=useState<any>();

  // Imported NFTs
  const [importedNfts, setImportedNfts]=useState<any[]>([]);

  const [currentStep, setCurrentStep]=useState<number>(0);
  
  const fetchERC721s= useCallback(async ()=>{
    const elements= await fetchContainingKeywordElements();
  
    console.log((elements as unknown as any[]).filter((element)=> typeof element.nftAddress === 'string' ));
  
    setImportedNfts((elements as unknown as any[]).filter((element)=> typeof element.nftAddress === 'string' ));
  },[]);
  

  const SPEEDS = {
    slow:  { tipMultiplier: 0.5, baseFeeMultiplier: 0.0 }, // low tip, no bump
    medium:{ tipMultiplier: 1.0, baseFeeMultiplier: 0.1 }, // normal tip, small base bump
    fast:  { tipMultiplier: 1.5, baseFeeMultiplier: 0.25 } // higher tip, larger base bump
  };
  

  useEffect(()=>{
    fetchERC721s();
  },[]);


    const getGasFee= async (isContractCall:boolean, isNFT?:boolean, txTemplate?:ethers.TransactionRequest)=>{
    try {
      const provider = new ethers.JsonRpcProvider(rpcURL);

      const walletToDecrypt= await ethers.Wallet.fromEncryptedJson(encryptedPrivatKey, password);

      const decryptedWallet = new ethers.Wallet(walletToDecrypt.privateKey, provider);

      console.log(decryptedWallet);

    const block = await provider.getBlock("latest");


    const gasFeeBase= block.baseFeePerGas;

    if(!gasFeeBase) throw new Error("Provider does not serve with the base of gas fee");

    if(isContractCall){
    let contract:ethers.Contract;
    if(isNFT){
      const nftInterface = new ethers.Interface(erc721Abi);
      contract = new ethers.Contract(erc721Address, nftInterface, decryptedWallet);

          console.log(contract.interface.getFunction('safeTransferFrom'), 'function exists');
const contractAddr= await contract.getAddress();
const data = contract.interface.encodeFunctionData("safeTransferFrom", [publicAddress, destinationAddress, erc721Id]);
const populatedTransaction:ethers.TransactionRequest = { to: contractAddr,from: publicAddress, data };


      const estimateGas= await decryptedWallet.estimateGas(populatedTransaction);


      const gasLimit = BigInt(estimateGas) * 105n / 100n; // add 5% buffer

  // 3. fee data
  const block = await provider.getBlock("latest");
  if (!block?.baseFeePerGas) throw new Error("Network doesn't expose baseFee (not EIP-1559)");
  const baseFee = BigInt(block.baseFeePerGas);

  // try to get a sensible tip
  const feeData = await provider.getFeeData();
  const currentTip = feeData.maxPriorityFeePerGas ? BigInt(feeData.maxPriorityFeePerGas) : ethers.parseUnits("2", "gwei");

  const out = {};
  for (const [speed, cfg] of Object.entries(SPEEDS)) {
    const tip = currentTip * BigInt(Math.floor(cfg.tipMultiplier * 100)) / 100n; // approximate multiplier
    const bumpedBase = baseFee + (baseFee * BigInt(Math.floor(cfg.baseFeeMultiplier * 100)) / 100n);
    // heuristic: allow base fee to rise 2x in next block window
    const maxFee = bumpedBase * 2n + tip;
    const expectedFee = (baseFee + tip) * gasLimit;
    const worstFee = maxFee * gasLimit;

    const populatedTx: ethers.TransactionRequest = {
      ...populatedTransaction,
      gasLimit: gasLimit,
      maxPriorityFeePerGas: tip,
      maxFeePerGas: maxFee
    };

    out[speed] = {
      gasLimit,
      maxPriorityFeePerGas: tip,
      maxFeePerGas: maxFee,
      expectedFeeWei: expectedFee,
      worstFeeWei: worstFee,
      expectedFeeEth: ethers.formatEther(expectedFee),
      worstFeeEth: ethers.formatEther(worstFee),
      populatedTx
    };
  }

  console.log(out);

  return out;
    }

    console.log('ERC20 starts');
      const erc20Interface = new ethers.Interface(erc20Abi);
      contract = new ethers.Contract(erc20Address, erc20Interface, decryptedWallet);


      const decimals = await contract.decimals();

      console.log(decimals);

      if(!decimals){
        alert("There are no decimals of the token");
        
        return;
      }
      
      const contractAddr= await contract.getAddress();

      const amountToBeSentInNumber= amountToSend * (10 ** Number(decimals));
      
      const amountToBeSent= BigInt(amountToBeSentInNumber);
      
      const allowanceTo= await contract.approve(destinationAddress, amountToBeSent);

      const tx = await allowanceTo.wait();

      console.log(tx);
      
      const data = contract.interface.encodeFunctionData("transferFrom", [publicAddress, destinationAddress, amountToBeSent]);
      
      const populatedTransaction:ethers.TransactionRequest = { to: contractAddr, from: publicAddress, data };

      console.log(populatedTransaction);

      const estimateGas= await decryptedWallet.estimateGas(populatedTransaction);


      const gasLimit = BigInt(estimateGas) * 102n / 100n; // add 2% buffer

  // 3. fee data
  const block = await provider.getBlock("latest");
  if (!block?.baseFeePerGas) throw new Error("Network doesn't expose baseFee (not EIP-1559)");
  const baseFee = BigInt(block.baseFeePerGas);

  // try to get a sensible tip
  const feeData = await provider.getFeeData();
  const currentTip = feeData.maxPriorityFeePerGas ? BigInt(feeData.maxPriorityFeePerGas) : ethers.parseUnits("2", "gwei");

  const out = {};
  for (const [speed, cfg] of Object.entries(SPEEDS)) {
    const tip = currentTip * BigInt(Math.floor(cfg.tipMultiplier * 100)) / 100n; // approximate multiplier
    const bumpedBase = baseFee + (baseFee * BigInt(Math.floor(cfg.baseFeeMultiplier * 100)) / 100n);
    // heuristic: allow base fee to rise 2x in next block window
    const maxFee = bumpedBase * 2n + tip;
    const expectedFee = (baseFee + tip) * gasLimit;
    const worstFee = maxFee * gasLimit;

    const populatedTx: ethers.TransactionRequest = {
      ...populatedTransaction,
      gasLimit: gasLimit,
      maxPriorityFeePerGas: tip,
      maxFeePerGas: maxFee
    };

    out[speed] = {
      gasLimit,
      maxPriorityFeePerGas: tip,
      maxFeePerGas: maxFee,
      expectedFeeWei: expectedFee,
      worstFeeWei: worstFee,
      expectedFeeEth: ethers.formatEther(expectedFee),
      worstFeeEth: ethers.formatEther(worstFee),
      populatedTx
    };
  }

        console.log(out);

      return out;
    }

    if(txTemplate){
      const txForEstimation={...txTemplate};

      const estimatedGasLimit = await decryptedWallet.estimateGas(txForEstimation);
  
        // 3) Produce suggestions
    const suggestions = {};
    for (const [k, v] of Object.entries(SPEEDS)) {
      const tip = BigInt(Math.floor(Number(ethers.parseUnits("2", "gwei")) * v.tipMultiplier)); // careful with types
      // compute a bumped baseFee to cover next blocks
      const bumpedBase = gasFeeBase + BigInt(Math.floor(Number(gasFeeBase) * v.baseFeeMultiplier));
      // safe maxFee = bumpedBase * 2 + tip (common heuristic)
      const maxFeePerGas = bumpedBase * 2n + tip;
      const maxPriorityFeePerGas = tip;
  
      const totalWei = estimatedGasLimit * maxFeePerGas;
      suggestions[k] = {
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(), // wei
        maxFeePerGas: maxFeePerGas.toString(),
        gasLimit: estimatedGasLimit.toString(),
        totalWei: totalWei.toString(),
        totalEth: ethers.formatEther(totalWei)
      };
    }
  
    return {
      baseFeePerGas: gasFeeBase.toString(),
      currentTip: ethers.parseUnits("2", "gwei").toString(),
      suggestions
    };
    }


    } catch (error) {
      console.log(error);
      alert(error);
    }

  }


  const moveToTransactionsSummary =  async ()=>{
   try {
    
     if(amountToSend && maxAmountToSend && (maxAmountToSend < amountToSend || amountToSend === 0)){
      alert("You are not able to send the provided amount");
      return;
    }

    if(destinationAddress.length !== 42 && !destinationAddress.startsWith("0x")){
      alert("You haven't provided a valid address");
      return;
    }

    const isNotContractTx=((erc20Address && erc20Address.trim() !== '') || (erc721Address && erc721Address.trim() !== ''));
    
    const information = await getGasFee(isNotContractTx, erc721Address && erc721Address.trim() !== '',  !isNotContractTx && {from:publicAddress, to:destinationAddress, value: BigInt(amountToSend * (10 ** 18))})

    console.log(information);

    setGasFeesOptions(information);

    setCurrentStep(1);
    setOpenModal(false);

   } catch (error) {
    alert(error);
    console.log(error);
   }
  
  }


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
  <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
    <p
      className='plasmo-text-white plasmo-text-lg plasmo-font-semibold'>From </p>

      <div className="
      plasmo-max-w-full plasmo-w-full plasmo-m-2 plasmo-self-center plasmo-flex plasmo-flex-col plasmo-gap-2
   plasmo-p-2 plasmo-bg-accent plasmo-border plasmo-rounded-lg plasmo-border-secondary">

   <div className="plasmo-flex plasmo-gap-3 plasmo-items-center">
 <div className="plasmo-w-10 plasmo-h-10 plasmo-rounded-full plasmo-bg-orange-500"></div>
<p className='plasmo-text-white plasmo-font-bold'>Your Wallet</p>
   </div>

    <p className='plasmo-text-white
    plasmo-line-clamp-1 plasmo-text-sm
    '>{publicAddress}</p>
      </div>
  </div>

<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
<p className='plasmo-text-white plasmo-font-semibold plasmo-text-lg'>Select Token Type</p>
  <div className='plasmo-flex plasmo-gap-2'>
<button onClick={()=>{
  setERC721Address(null);
  setERC721Id(null);
  setTokenType("ERC20");

  }} className={`plasmo-rounded-lg plasmo-p-2 ${tokenType === "ERC20" ? "plasmo-bg-accent plasmo-text-secondary hover:plasmo-bg-secondary/70 hover:plasmo-text-accent" : "plasmo-text-accent plasmo-bg-secondary hover:plasmo-bg-secondary/70"} hover:plasmo-scale-95 plasmo-transition-all`}>
  ERC20s/Native Token
</button>
<button onClick={()=>{
setERC20Address(null);
setAmountToSend(0);

  setTokenType('NFT');
}} className={` plasmo-rounded-lg plasmo-p-2 ${tokenType === "NFT" ? "plasmo-bg-accent plasmo-text-secondary hover:plasmo-bg-secondary/70 hover:plasmo-text-accent" : "plasmo-text-accent plasmo-bg-secondary hover:plasmo-bg-secondary/70"} hover:plasmo-scale-95 plasmo-transition-all`}>
  NFTs
</button>
  </div>
</div>

{tokenType === 'ERC20' && 
<div className="plasmo-flex plasmo-gap-2">
  <input
  step="0.001"
  min={0}
  onChange={(e)=>{
setAmountToSend(+e.target.value);
  }}
type='number'
  max={maxAmountToSend}
  placeholder='Amount to be sent'
  className='plasmo-bg-accent
  plasmo-w-full
  plasmo-p-2 plasmo-rounded-lg plasmo-border plasmo-border-secondary plasmo-text-white'/>
  <DropdownMenu.Root>
	<DropdownMenu.Trigger
  className='
  plasmo-text-secondary
  plasmo-text-2xl
  plasmo-px-2
  '
  >
		<RiTokenSwapFill/>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
  className='
  plasmo-mr-20 plasmo-bg-accent plasmo-border plasmo-border-secondary
  plasmo-text-white plasmo-mt-4 plasmo-p-2 plasmo-rounded-lg
  plasmo-max-w-56 plasmo-w-full plasmo-h-52 plasmo-overflow-y-auto
  plasmo-flex plasmo-flex-col plasmo-gap-3
  '
  >
		{
      tokens.map((element, index)=>(
                		<DropdownMenu.Item
                    id={element.tokenAddress}
            className={`
            plasmo-text-white plasmo-flex plasmo-items-center plasmo-gap-2
            plasmo-cursor-pointer
            ${erc20Address === element.tokenAddress ? "plasmo-bg-primary plasmo-p-2 plasmo-rounded-lg" :
             ""}
            `}
            onClick={()=>{
              console.log(element);
              console.log('hello');

              if(!element.tokenAddress){
                setMaxAmountToSend(element.tokenBalance / 10 ** 18);
                return;
              }
              setMaxAmountToSend(element.tokenBalance / 10 ** element.tokenMetadata.decimals);
              setERC20Address(element.tokenAddress);
            }}
            >

<p
className='
plasmo-font-semibold
'
>
{
(Number(
  element.tokenBalance
) / 10 ** (element.tokenMetadata.decimals
 ?? 18
)).toFixed(4)
}
</p>

<span
className='
plasmo-text-secondary plasmo-font-bold
'
>
{element.tokenMetadata.symbol ??
currentNetworkNativeTokenSymbol
}
</span>



            </DropdownMenu.Item>
      ))
    }


	</DropdownMenu.Content>
</DropdownMenu.Root>
</div>
}

{tokenType === 'NFT' &&
<div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-border-t plasmo-border-secondary plasmo-pt-4 ">
{nftElements && nftElements.length > 0 && <>
{nftElements.map((element)=>(
  
    <div onClick={()=>{
  setERC721Address(element.contract.address);
  setERC721Id(element.tokenId);
}}

className='plasmo-flex plasmo-gap-4 plasmo-bg-accent plasmo-border-secondary plasmo-border plasmo-rounded-lg
plasmo-justify-between plasmo-items-center plasmo-p-3 plasmo-text-white plasmo-cursor-pointer'>
<img
src={element.image.thumbnailUrl}
width={32}
height={32}
className='plasmo-w-8 plasmo-h-8 plasmo-rounded-lg
plasmo-border-secondary plasmo-border
'
alt={`${element.description}`}
/>

<div className="
plasmo-flex plasmo-flex-col plasmo-gap-1">
  <p
  className='
  plasmo-text-white plasmo-font-semibold'>
    {element.name}
  </p>
  <p
  className='
  plasmo-text-secondary plasmo-text-sm plasmo-font-light
  '
  >
    {
      element.description
    }
  </p>
</div>

<p
className='plasmo-text-secondary plasmo-text-lg'>
#{Number(element.tokenId)}
</p>

</div>
))}
</>}


{importedNfts.length > 0 && importedNfts.map((
  element
)=>(
  <div onClick={()=>{
    setERC721Address(element.nftAddress);
    setERC721Id(element.tokenId);
}} className='plasmo-flex plasmo-gap-4 plasmo-bg-accent plasmo-border-secondary plasmo-border plasmo-rounded-lg
plasmo-justify-between plasmo-items-center plasmo-p-3 plasmo-text-white plasmo-cursor-pointer'>
<img
src={element.image}
width={32}
height={32}
className='plasmo-w-8 plasmo-h-8 plasmo-rounded-lg
plasmo-border-secondary plasmo-border
'
alt={`${element.description}`}
/>

<div className="
plasmo-flex plasmo-flex-col plasmo-gap-1">
  <p
  className='
  plasmo-text-white plasmo-font-semibold'>
    {element.tokenName}
  </p>
  <p
  className='
  plasmo-text-secondary plasmo-text-sm plasmo-font-light
  '
  >
    {
      element.description
    }
  </p>
</div>

<p
className='plasmo-text-secondary plasmo-text-lg'>
#{Number(element.tokenId)}
</p>

</div>
))
}

{(!nftElements && nftElements.length === 0) && importedNfts.length === 0 &&
<div className='plasmo-flex plasmo-items-center plasmo-justify-center plasmo-w-full plasmo-flex-col plasmo-gap-2'>
  <p className='plasmo-text-white plasmo-font-semibold plasmo-text-lg'>No NFTs Found</p>
  <p className='plasmo-text-white plasmo-text-center plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-font-semibold plasmo-text-lg'>Start Exploring NFT World on <Link to={'https://opensea.io/'} target='_blank'><SiOpensea className='plasmo-text-secondary plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-2xl'/></Link></p>
</div>}

</div>
}


  <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
<p
className='
plasmo-text-white plasmo-font-semibold plasmo-text-lg
'
>To </p>

  <input
  onChange={(e)=>{
      setDestinationAddress(e.target.value as `0x${string}`);
  }}
  type='text'
  placeholder='Destination/Receiver Address'
  className='plasmo-bg-accent
  plasmo-w-full
  plasmo-p-2 plasmo-rounded-lg plasmo-border plasmo-border-secondary plasmo-text-white'/>


  </div>


<button
onClick={()=>setOpenModal(true)}
className='plasmo-bg-secondary plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'
>
  Approve
</button>
  </>
}

{openModal && <TransferModal setCloseModal={()=>setOpenModal(false)}>
    <div className="plasmo-flex plasmo-flex-col plasmo-w-full plasmo-h-full plasmo-p-2 plasmo-justify-between">
<div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-self-center plasmo-w-full">
  <p
className='
plasmo-text-white plasmo-font-semibold plasmo-text-lg
'
>Password </p>

  <input
  onChange={(e)=>{
      setPassword(e.target.value);
  }}
  type='text'
  placeholder='Enter your password...'
  className='plasmo-bg-accent
  plasmo-w-full
  plasmo-p-2 plasmo-rounded-lg plasmo-border plasmo-border-secondary plasmo-text-white'/>
</div>

<button
onClick={moveToTransactionsSummary}
className='plasmo-bg-secondary plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'
>
  Summarize the Transaction
</button>

  </div>

  
  </TransferModal>}

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