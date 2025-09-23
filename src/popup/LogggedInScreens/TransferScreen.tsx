import React, { useState } from 'react'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import TransferTokenForm from '~popup/component/forms/transfer/TransferTokenForm';
import TransactionSummary from '~popup/component/TransactionSummary';

function TransferScreen() {

  const [currentStep, setCurrentStep]=useState<number>(0);
const [maxAmountToSend, setMaxAmountToSend]=useState<number>();
const [password, setPassword]=useState<string>();
const [gasFeeOptions, setGasFeeOptions]=useState<any>();

  const zodERC20TxSchema= z.object({
    erc20TokenAddress: z.string().startsWith("0x",{'error': 'Invalid ERC20 Token Address !'}).length(42, {'error':'Invalid length of the contract address'}).optional(),
    receiverAddress: z.string().startsWith("0x",{'error': 'Invalid Receiver Address !'}).length(42, {'error':'Invalid length of receiver contract'}),
    tokenAmountToBeSent: z.number({'error':'Invalid type'}).lte(maxAmountToSend, {'error':'The provided number is larger than the all possible amount.'})
    });

    const zodNFTTxSchema= z.object({
      nftTokenAddress: z.string().startsWith("0x",{'error': 'Invalid ERC20 Token Address !'}).length(42, {'error':'Invalid length of the contract address'}),
      receiverAddress: z.string().startsWith("0x",{'error': 'Invalid Receiver Address !'}).length(42, {'error':'Invalid length of receiver contract'}),
      tokenId: z.bigint({'error':'Invalid type of tokenId provided'}).positive({'error':"Invalid value of tokenId."})
    })
    

    const erc20Methods =useForm<z.infer<typeof zodERC20TxSchema>>({
        resolver: zodResolver(zodERC20TxSchema)
      });

      const nftMethods=useForm<z.infer<typeof zodNFTTxSchema>>({
        resolver: zodResolver(zodNFTTxSchema)
      });

  
  
  return (
<FormProvider {...nftMethods}> 
  <FormProvider {...erc20Methods}>
    <div
    className='
    plasmo-w-full
    plasmo-flex plasmo-flex-col plasmo-gap-4
    plasmo-h-screen plasmo-overflow-auto'
    >

{
  currentStep === 0 &&
  <>
  <TransferTokenForm
  password={password}
  setPassword={setPassword}
   setCurrentStep={setCurrentStep} 
   setMaxAmountToSend={setMaxAmountToSend} 
   maxAmountToSend={maxAmountToSend}
   setGasFeesOptions={setGasFeeOptions}
   />
  </>
}



{
currentStep === 1 && <TransactionSummary gasFeesOptions={gasFeeOptions} password={password} maxAmountToSend={maxAmountToSend}/>
}

      
    </div>
  </FormProvider>
</FormProvider>

  )
}

export default TransferScreen