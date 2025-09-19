import { ethers } from 'ethers';
import { DropdownMenu } from 'radix-ui';
import React, { useState } from 'react'
import { RiTokenSwapFill } from 'react-icons/ri';
import useFetchTokensData from '~popup/hooks/useFetchTokensData';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper'
import * as z from 'zod';
import  bcrypt  from 'bcryptjs';


function TransferScreen() {
  const publicAddress= useAppSelector((state)=>state.loggedIn.address);
  const encryptedPrivatKey= useAppSelector((state)=>state.loggedIn.encryptedWallet);
  const currentNetworkNativeTokenSymbol= useAppSelector((state)=>state.currentNetworkConnected.currencySymbol);
  const currentNetworkChainID= useAppSelector((state)=>state.currentNetworkConnected.chainId);
  const rpcURL=useAppSelector((state)=>state.currentNetworkConnected.rpcURL);
  const {tokens}=useFetchTokensData();
  const [amountToSend, setAmountToSend]=useState<number>();
  const [destinationAddress, setDestinationAddress]=useState<`0x${string}`>();

  const validationObject=z.object({
    amountToBeSent: z.number().positive(),
    isERC20:z.boolean(),
    isERC721: z.boolean(),
    nftsID: z.number().positive(),
  })



  const handleTxaction =async ()=>{

    if(destinationAddress.length !== 42){
      alert('Invalid Destination Address');
      return;
    }
    
    const provider = new ethers.JsonRpcProvider(rpcURL);
    const wallet = await ethers.Wallet.fromEncryptedJson(encryptedPrivatKey,"[password]");

    const walletDecrypted = new ethers.Wallet(wallet.privateKey, provider);

    console.log(
      wallet
    );

    const tx= 
    await walletDecrypted.sendTransaction({
  from:publicAddress,
  to: destinationAddress,
  value:BigInt(amountToSend * (10**18)),
  'chainId': currentNetworkChainID,  
    });

    console.log(
      tx
    );

    const receiptTx= await tx.wait();

    console.log(receiptTx);


    
  };


  
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
className='
plasmo-bg-secondary plasmo-border-accent plasmo-p-2 plasmo-rounded-lg plasmo-text-accent
hover:plasmo-bg-accent hover:plasmo-text-secondary plasmo-transition-all hover:plasmo-border-secondary
hover:plasmo-scale-95
'
onClick={
  handleTxaction
}
>
Send Transaction
</button>
      
    </div>
  )
}

export default TransferScreen