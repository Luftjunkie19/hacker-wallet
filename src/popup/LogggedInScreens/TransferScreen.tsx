import { ethers } from 'ethers';
import { DropdownMenu } from 'radix-ui';
import React, { useState } from 'react'
import { RiTokenSwapFill } from 'react-icons/ri';
import useFetchTokensData from '~popup/hooks/useFetchTokensData';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper'
import * as z from 'zod';
import {useForm} from 'react-hook-form';
type Props = {}
import {zodResolver} from "@hookform/resolvers/zod";

function TransferScreen({}: Props) {
  const publicAddress= useAppSelector((state)=>state.loggedIn.address);
  const {tokens}=useFetchTokensData();

  const validationObject=z.object({
    amountToBeSent: z.number().positive(),
    isERC20:z.boolean(),
    isERC721: z.boolean(),
    nftsID: z.number().positive(),
  })

  const {
    register,
    reset,
  watch,
  handleSubmit
  }=useForm(
    {
resolver:zodResolver(validationObject)
    }
  )



  const handleTxaction =async ()=>{
    const provider = new ethers.AlchemyProvider('homestead', process.env.PLASMO_PUBLIC_ALCHEMY_API_KEY);
  
    const res = await provider.estimateGas({
      to:'',
      from:publicAddress,
      value:ethers.parseEther(`${amountToSend}`),
    })
  };


  
  return (
    <div
    className='
    plasmo-w-full
    plasmo-flex plasmo-flex-col plasmo-gap-4
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
type='number'
  onChange={(e)=>{
    setAmountToSend(Number(e.target.value));
  }}
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
  plasmo-text-white plasmo-mt-6 plasmo-p-2 plasmo-rounded-lg
  plasmo-max-w-56 plasmo-w-full plasmo-h-52 plasmo-overflow-y-auto
  '
  >
		{
      tokens.map((element)=>(
        		<DropdownMenu.Item
            className='
            plasmo-text-white
            '
            onClick={()=>{

              if(element.tokenAddress !== null){
              setTokenToBeSent(
                element.tokenAddress
              );
              return;
              }

              setTokenToBeSent(
                `0x0000000000000000000000000000000000000000`
              );

            }}
            >

{
  JSON.stringify(
    element
  )
}

            </DropdownMenu.Item>
      ))
    }


	</DropdownMenu.Content>
</DropdownMenu.Root>
</div>

  <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">

  </div>

      
    </div>
  )
}

export default TransferScreen