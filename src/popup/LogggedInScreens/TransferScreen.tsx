import React, { useState } from 'react'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import TransferTokenForm from '~popup/component/forms/transfer/TransferTokenForm';
import TransactionSummary from '~popup/component/TransactionSummary';

function TransferScreen() {
const [tokenType, setTokenType]=useState<'ERC20' | 'NFT'>('ERC20');
  const [currentStep, setCurrentStep]=useState<number>(0);
const [maxAmountToSend, setMaxAmountToSend]=useState<number>(0);
const [password, setPassword]=useState<string>();
const [gasFeeOptions, setGasFeeOptions]=useState<any>(null);

  const zodERC20TxSchema= z.object({
    erc20TokenAddress: z.string().startsWith("0x",{'error': 'Invalid ERC20 Token Address !'}).length(42, {'error':'Invalid length of the contract address'}).nullish().optional(),
    receiverAddress: z.string().startsWith("0x",{'error': 'Invalid Receiver Address !'}).length(42, {'error':'Invalid length of receiver contract'}),
    tokenAmountToBeSent: z.number({'error':'Invalid type'}).lte(maxAmountToSend, {'error':'The provided number is larger than the all possible amount.'}).gt(0, {'error':'Has to be greater than 0.'}),
    }).required({receiverAddress:true, tokenAmountToBeSent:true});


    const zodNFTTxSchema= z.object({
      nftTokenAddress: z.string().startsWith("0x",{'error': 'Invalid ERC20 Token Address !'}).length(42, {'error':'Invalid length of the contract address'}),
      receiverAddress: z.string().startsWith("0x",{'error': 'Invalid Receiver Address !'}).length(42, {'error':'Invalid length of receiver contract'}),
      tokenId: z.bigint({'error':'Invalid type of tokenId provided'}).positive({'error':"Invalid value of tokenId."})
    }).required({receiverAddress:true, tokenId:true, nftTokenAddress:true});
    

    const erc20Methods =useForm<z.infer<typeof zodERC20TxSchema>>({
        resolver: zodResolver(zodERC20TxSchema),
        defaultValues:{
          'erc20TokenAddress':null,
          'receiverAddress':'',
          'tokenAmountToBeSent': Number(0),
        }
      });

      const nftMethods=useForm<z.infer<typeof zodNFTTxSchema>>({
        resolver: zodResolver(zodNFTTxSchema),
        defaultValues:{
          'nftTokenAddress':'',
          'receiverAddress':'',
          'tokenId':null,
        }
      });

  
  
  return (
<>
{tokenType === 'ERC20' ?  
<FormProvider {...erc20Methods}>

{
  currentStep === 0 &&
  <TransferTokenForm
  tokenType={tokenType}
  setTokenType={setTokenType}
  password={password}
  setPassword={setPassword}
   setCurrentStep={setCurrentStep} 
   setMaxAmountToSend={setMaxAmountToSend} 
   maxAmountToSend={maxAmountToSend}
   setGasFeesOptions={setGasFeeOptions}
   />
}


{
currentStep === 1 && <TransactionSummary gasFeesOptions={gasFeeOptions} password={password} maxAmountToSend={maxAmountToSend}/>
}

      

  </FormProvider> : <FormProvider {...nftMethods}> 



{
  currentStep === 0 &&

  <TransferTokenForm
  tokenType={tokenType}
  setTokenType={setTokenType}
  password={password}
  setPassword={setPassword}
   setCurrentStep={setCurrentStep} 
   setMaxAmountToSend={setMaxAmountToSend} 
   maxAmountToSend={maxAmountToSend}
   setGasFeesOptions={setGasFeeOptions}
   />
}

{
currentStep === 1 && <TransactionSummary gasFeesOptions={gasFeeOptions} password={password} maxAmountToSend={maxAmountToSend}/>
}
  </FormProvider>
}
</>
  )
}

export default TransferScreen