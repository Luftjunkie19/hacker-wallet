import { ethers } from 'ethers';
import { DropdownMenu } from 'radix-ui';
import React, { useState } from 'react'
import { RiTokenSwapFill } from 'react-icons/ri';
import useFetchTokensData from '~popup/hooks/useFetchTokensData';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper'
import * as z from 'zod';
import  bcrypt  from 'bcryptjs';
import { erc20Abi } from '~popup/abis/ERC20';
import { erc721Abi } from '~popup/abis/ERC721';
import useFetchNftData from '~popup/hooks/useFetchNftData';
import { Link } from 'react-router-dom';
import { SiOpensea } from 'react-icons/si';


function TransferScreen() {
  const publicAddress= useAppSelector((state)=>state.loggedIn.address);
  const encryptedPrivatKey= useAppSelector((state)=>state.loggedIn.encryptedWallet);
  const passwordOfSession = useAppSelector((state)=>state.loggedIn.password);
  const currentNetworkNativeTokenSymbol= useAppSelector((state)=>state.currentNetworkConnected.currencySymbol);
  const currentNetworkChainID= useAppSelector((state)=>state.currentNetworkConnected.chainId);
  const rpcURL=useAppSelector((state)=>state.currentNetworkConnected.rpcURL);
  const {tokens}=useFetchTokensData();
  const {elements:nftElements}=useFetchNftData();

  const [amountToSend, setAmountToSend]=useState<number>();
  const [erc20Address, setERC20Address]=useState<`0x${string}` | null>();
  const [erc721Address, setERC721Address]=useState<`0x${string}` | null>();
  const [erc721Id, setERC721Id]=useState<number | null>(null);
  const [tokenType, setTokenType]=useState<"ERC20" | "NFT">("ERC20");
  const [password, setPassword]=useState<string>();


  const [destinationAddress, setDestinationAddress]=useState<`0x${string}`>();


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


    const tx= await nftContract.safeTransferFrom(publicAddress, destinationAddress, erc721Id);

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

      const contract= new ethers.Contract(erc20Address, erc20Interface,walletDecrypted);

      const decimals= await contract.decimals();

     const tx = await contract.transferFrom(publicAddress, destinationAddress, amountToSend * (10 ** decimals));

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
    });

    const receiptTx= await tx.wait();

    console.log(receiptTx);

      
    } catch (error) {

      console.log(error);
      
    }
      
  };

  const getTxGasLimits= ()=>{}

  
  return (
    <div
    className='
    plasmo-w-full
    plasmo-flex plasmo-flex-col plasmo-gap-4
    plasmo-h-full
    '
    >
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
<button onClick={()=>setTokenType("ERC20")} className={`plasmo-rounded-lg plasmo-p-2 ${tokenType === "ERC20" ? "plasmo-bg-accent plasmo-text-secondary hover:plasmo-bg-secondary/70 hover:plasmo-text-accent" : "plasmo-text-accent plasmo-bg-secondary hover:plasmo-bg-secondary/70"} hover:plasmo-scale-95 plasmo-transition-all`}>
  ERC20s/Native Token
</button>
<button onClick={()=>setTokenType('NFT')} className={` plasmo-rounded-lg plasmo-p-2 ${tokenType === "NFT" ? "plasmo-bg-accent plasmo-text-secondary hover:plasmo-bg-secondary/70 hover:plasmo-text-accent" : "plasmo-text-accent plasmo-bg-secondary hover:plasmo-bg-secondary/70"} hover:plasmo-scale-95 plasmo-transition-all`}>
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
      tokens.map((element)=>(
        		<DropdownMenu.Item
            className='
            plasmo-text-white plasmo-flex plasmo-items-center plasmo-gap-2
            plasmo-cursor-pointer
            '
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
{nftElements.map((element)=>(<div onClick={()=>{
  setERC721Address(element.contract.address);
  setERC721Id(element.tokenId);
}} className='plasmo-flex plasmo-flex-col plasmo-gap-2'>
  <p className='plasmo-text-white plasmo-font-semibold plasmo-text-lg'>{element.tokenId}</p>
  <p className='plasmo-text-white plasmo-font-semibold plasmo-text-lg'>{element.name}</p>
  <p className='plasmo-text-white plasmo-font-semibold plasmo-text-lg'>{element.description}</p>
  <p className='plasmo-text-white plasmo-font-semibold plasmo-text-lg'>{element.image.thumbnailUrl}</p>
</div>))}
</>}

{!nftElements || nftElements.length === 0 && <div className='plasmo-flex plasmo-items-center plasmo-justify-center plasmo-w-full plasmo-flex-col plasmo-gap-2'>
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
className='plasmo-bg-secondary plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'
onClick={()=>{}}>
  Summarize the Transaction
</button>
      
    </div>
  )
}

export default TransferScreen