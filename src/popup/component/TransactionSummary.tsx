import bcrypt from 'bcryptjs'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import {  useFormContext } from 'react-hook-form'
import { FaArrowDown, FaCheckCircle } from 'react-icons/fa'
import { GiSloth } from 'react-icons/gi'
import { LuBatteryMedium } from 'react-icons/lu'
import { MdFastfood } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { erc721Abi } from '~popup/abis/ERC721'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper'
import * as z from 'zod';
import { erc20Abi } from '~popup/abis/ERC20'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { deleteKey, fetchContainingKeywordElements } from '~popup/IndexedDB/WalletDataStorage'
import useEthersComponents from '~popup/hooks/useEthersComponents'
type Props = {
    password:string
    maxAmountToSend:number,
    gasFeesOptions:any
}

function TransactionSummary({password, maxAmountToSend, gasFeesOptions}: Props) {
    const currentNetworkName= useAppSelector((state)=>state.currentNetworkConnected.networkName);
    const [selectedGasOption, setGasOption]=useState<any>();
    const [isLoading, setIsLoading]=useState<boolean>(false);
    const [isSuccess , setIsSuccess]=useState<boolean>(false);
    const publicAddress= useAppSelector((state)=>state.loggedIn.address);
    const currentNetworkChainID = useAppSelector((state)=>state.currentNetworkConnected.chainId);
    const navigate =useNavigate();

    const { getWallet, checkValidity}=useEthersComponents();

    const zodERC20TxSchema= z.object({
        erc20TokenAddress: z.string().startsWith("0x",{'error': 'Invalid ERC20 Token Address !'}).length(42, {'error':'Invalid length of the contract address'}).optional(),
        receiverAddress: z.string().startsWith("0x",{'error': 'Invalid Receiver Address !'}).length(42, {'error':'Invalid length of receiver contract'}),
        tokenAmountToBeSent: z.number({'error':'Invalid type'}).lte(maxAmountToSend, {'error':'The provided number is larger than the all possible amount.'})
        });
    
        const zodNFTTxSchema= z.object({
          nftTokenAddress: z.string().startsWith("0x",{'error': 'Invalid ERC20 Token Address !'}).length(42, {'error':'Invalid length of the contract address'}),
          receiverAddress: z.string().startsWith("0x",{'error': 'Invalid Receiver Address !'}).length(42, {'error':'Invalid length of receiver contract'}),
          tokenId: z.bigint().positive({'error':"Invalid value of tokenId."})
        })
        

    const {watch:nftWatch, handleSubmit:nftHandleSubmit, reset}=useFormContext<z.infer<typeof zodNFTTxSchema>>();
    const {watch, handleSubmit, reset:resetERC20}=useFormContext<z.infer<typeof zodERC20TxSchema>>();


    const sendNftToken = async ()=>{
        try{
                  setIsSuccess(false);

       await checkValidity(password);
    
        const walletDecrypted = await getWallet(password);
      
        const nftInterface= new ethers.Interface(erc721Abi);
    
        const nftContract= new ethers.Contract(nftWatch('nftTokenAddress'), nftInterface, walletDecrypted);
    
        const contractAddr= await nftContract.getAddress();

        const approvalTx= await nftContract.approve(nftWatch('receiverAddress'), BigInt(nftWatch('tokenId')));

        const approvalResult= await approvalTx.wait();
        
        if(!approvalResult){
          alert('Something went wrong with approval of NFT');
          throw new Error('Approval failed');
        }
    console.log(selectedGasOption, 'Selected Gas Option');

    const data = nftContract.interface.encodeFunctionData("safeTransferFrom", [publicAddress, nftWatch('receiverAddress'), BigInt(nftWatch('tokenId'))]);
    const populatedTransaction:ethers.TransactionRequest = { to: contractAddr,from: publicAddress, data };
    
        const tx= await walletDecrypted.sendTransaction({
          data: populatedTransaction.data,
          to: populatedTransaction.to,
          from: populatedTransaction.from,
          value: populatedTransaction.value,
          chainId: currentNetworkChainID,
          gasLimit: BigInt(selectedGasOption.gasLimit),
          maxFeePerGas: BigInt(selectedGasOption.maxFeePerGas),
          maxPriorityFeePerGas: BigInt(selectedGasOption.maxPriorityFeePerGas),
        });
    
        const result = await tx.wait();

             if(result && result.hash){ 
                       const loadedElements= await fetchContainingKeywordElements();
               
                       const foundElement = loadedElements.find((item)=>item.nftAddress === contractAddr);
               
                       if(foundElement){
                         await deleteKey(`erc721-${contractAddr}`);
                       }
          setIsSuccess(true);
             reset();
         }

        }catch(err){
          console.log(err);
                  setIsSuccess(false);
        }
      }
    

      
      const sendERC20Token = async ()=>{
        try {
                       setIsSuccess(false);

         await checkValidity(password);

         const walletDecrypted = await getWallet(password);
          
          const erc20Interface= new ethers.Interface(erc20Abi);
    
          const contract= new ethers.Contract(watch('erc20TokenAddress'), erc20Interface, walletDecrypted);
    
          const decimals= await contract.decimals();
    
        const erc20Contract= new ethers.Contract(watch('erc20TokenAddress'), erc20Interface, walletDecrypted);
    
        const contractAddr= await erc20Contract.getAddress();

        console.log(decimals, 'Decimals');
    
        const amountToBeSent= BigInt(watch('tokenAmountToBeSent') * (10 ** Number(decimals)));
    
    const data = erc20Contract.interface.encodeFunctionData("transfer", [watch('receiverAddress'), amountToBeSent]);
    const populatedTransaction:ethers.TransactionRequest = { to: contractAddr,from: publicAddress, data };
    
    console.log({populatedTransaction, data});

    console.log(selectedGasOption, 'Selected Gas Option ERC20');

    console.log(gasFeesOptions, 'Gas Fees Options ERC20');

        const tx = await walletDecrypted.sendTransaction({
          data: data,
          to: populatedTransaction.to,
          from: populatedTransaction.from,
          value: 0n,
          chainId: currentNetworkChainID,
          gasLimit: selectedGasOption.gasLimit ? selectedGasOption.gasLimit : gasFeesOptions.medium.gasLimit,
          maxFeePerGas:selectedGasOption.maxFeePerGas  ? selectedGasOption.maxFeePerGas : gasFeesOptions.medium.maxFeePerGas,
          maxPriorityFeePerGas: selectedGasOption.maxPriorityFeePerGas ? selectedGasOption.maxPriorityFeePerGas : gasFeesOptions.medium.maxPriorityFeePerGas
        });
    
         const result = await tx.wait();
    
         if(result && result.hash){
          setIsSuccess(true);
          resetERC20();
         }

         console.log(result);
          
        } catch (error) {
            alert(`Transaction Failed !: ${error}`);
          console.log(error);
          setIsSuccess(false);
        }
    
      }
    
      const handleNativeTokenTransaction =async ()=>{
    
        if(watch('receiverAddress').length !== 42){
          alert('Invalid Destination Address');
          return;
        }
    
        try {
                       setIsSuccess(false);
        await checkValidity(password);

        const walletDecrypted = await getWallet(password);
    
        const tx= await walletDecrypted.sendTransaction({
      from:publicAddress,
      to: watch('receiverAddress'),
      value: BigInt(watch('tokenAmountToBeSent') * (10**18)),
      'chainId': currentNetworkChainID,
      gasLimit: selectedGasOption.gasLimit ? BigInt(selectedGasOption.gasLimit) : gasFeesOptions.medium.gasLimit,
          maxFeePerGas:selectedGasOption.maxFeePerGas  ? BigInt(selectedGasOption.maxFeePerGas) : gasFeesOptions.medium.maxFeePerGas,
          maxPriorityFeePerGas:  selectedGasOption.maxPriorityFeePerGas ? BigInt(selectedGasOption.maxPriorityFeePerGas) : gasFeesOptions.medium.maxPriorityFeePerGas
        });
    
        const receiptTx= await tx.wait();
    
        console.log(receiptTx);

          setIsSuccess(true);
          resetERC20();
          reset();

        } catch (error) {
    alert(`Transaction Failed !: ${error}`);
          console.log(error);
          setIsSuccess(false);
        }
          
      };
    
    
      const handleFinalTransaction= async ()=>{
    setIsLoading(true);
        try {
          console.log('function gets executed');

          console.log(nftWatch('nftTokenAddress'), nftWatch('tokenId'), watch('erc20TokenAddress'), watch('tokenAmountToBeSent'));
    
          if(nftWatch('nftTokenAddress') && nftWatch('nftTokenAddress').length === 42 && nftWatch('tokenId')){
              console.log('Start of NFT Tx');
                await sendNftToken();
                return;
          }
    
          if(watch('erc20TokenAddress') && watch('erc20TokenAddress').length === 42){

          console.log('Start of ERC20 Tx');
            await sendERC20Token();
            return;
         
          }
          
            console.log('Start of native Tx');
            await handleNativeTokenTransaction();
          
        
    
        }catch(err){
          alert(err);
          console.log(err);

        }finally{
          setIsLoading(false);
        }
    
      }
    
      

  return (<>
  {isLoading && !isSuccess &&
  <div className='  plasmo-w-full
    plasmo-flex plasmo-flex-col plasmo-gap-4
    plasmo-h-screen plasmo-overflow-auto plasmo-justify-center plasmo-items-center'>
      <AiOutlineLoading3Quarters className='plasmo-animate-spin plasmo-text-secondary plasmo-text-2xl' />
      <p className='plasmo-text-secondary plasmo-font-semibold plasmo-text-lg'>
      Loading...
      </p>
      <p className='plasmo-text-secondary plasmo-font-light plasmo-text-sm'>Please wait while we process your transaction.</p>

      </div>
  }

{isSuccess && !isLoading && <div className='plasmo-w-full
    plasmo-flex plasmo-flex-col plasmo-gap-4
    plasmo-h-screen plasmo-overflow-auto plasmo-justify-center plasmo-items-center'>

      <FaCheckCircle className='plasmo-text-secondary plasmo-text-4xl' />

      <p className='plasmo-text-secondary plasmo-font-semibold plasmo-text-lg'>
      Transaction Successful !
      </p> 

      <button
      onClick={()=>{
        navigate('/');
      }}
      className='plasmo-bg-secondary plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'
      >
        Go Back Home
      </button>

  </div>} 

  


  {!isLoading && !isSuccess && nftWatch('nftTokenAddress') && nftWatch('nftTokenAddress').trim().length === 42 && nftWatch('tokenId') &&
    <form className='
    plasmo-w-full
    plasmo-flex plasmo-flex-col plasmo-gap-4
    plasmo-h-screen plasmo-overflow-auto' onSubmit={nftHandleSubmit(handleFinalTransaction, (err)=>{
      console.log(err);
    })}>
    <p
className='plasmo-text-secondary plasmo-font-semibold plasmo-text-lg
'>
  Transaction Summary (NFT)
</p>


<div className="plasmo-flex plasmo-flex-col gap-2 plasmo-w-full plasmo-items-center plasmo-justify-center">
  <div className="plasmo-bg-accent plasmo-p-2 plasmo-rounded-lg plasmo-w-full">
    <p className='plasmo-text-secondary plasmo-font-semibold plasmo-text-lg'>From</p>
    <p className='plasmo-text-white plasmo-font-light plasmo-line-clamp-1'>{publicAddress}</p>
  </div>
<FaArrowDown/>
<div className="plasmo-bg-accent plasmo-p-2 plasmo-rounded-lg plasmo-w-full">
  <p className='plasmo-text-secondary font-semibold plasmo-text-lg'>To</p>
  <p className='plasmo-text-white plasmo-font-light plasmo-line-clamp-1'>{watch('receiverAddress') || nftWatch('receiverAddress')}</p>
</div>
</div>


<div className="plasmo-bg-accent plasmo-px-2 plasmo-py-4 plasmo-rounded-lg plasmo-text-white plasmo-w-full plasmo-flex plasmo-justify-between plasmo-items-center">
  <p>Network</p>

  <p>{currentNetworkName}</p>
</div>



<div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-full">
<p className='plasmo-text-white'>Speed Of Tranasaction</p>
{gasFeesOptions &&
<div className="plasmo-w-full plasmo-grid plasmo-grid-cols-3 plasmo-items-center plasmo-gap-2">

{Object.values(gasFeesOptions).map((element, index)=>(
<button 
key={index}
onClick={(e)=>{
  e.preventDefault();
  setGasOption(element);
}} className={`${selectedGasOption && Number((element as any).maxFeePerGas) === Number(selectedGasOption.maxFeePerGas) ? 'plasmo-bg-secondary/70 plasmo-border-accent plasmo-border-2' : 'plasmo-bg-accent'} plasmo-p-3 plasmo-rounded-lg plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-items-center plasmo-justify-center`}>
<p className='plasmo-text-sm plasmo-text-white'>{
  index === 0 ? 'Slow' : index === 1 ? 'Medium' : 'Fast'
  }</p>

{ index === 0 &&
<GiSloth className={`${selectedGasOption && Number((element as any).maxFeePerGas) === Number(selectedGasOption.maxFeePerGas) ? 'plasmo-text-accent' : 'plasmo-text-secondary'}`}/>
}

{index === 1 && 
<LuBatteryMedium className={`${selectedGasOption &&  Number((element as any).maxFeePerGas) === Number(selectedGasOption.maxFeePerGas) ? 'plasmo-text-accent' : 'plasmo-text-secondary'}`}/>
}

{index === 2 && 
<MdFastfood className={`${selectedGasOption &&  Number((element as any).maxFeePerGas) === Number(selectedGasOption.maxFeePerGas) ? 'plasmo-text-accent' : 'plasmo-text-secondary'}`}/>
}

</button>
))}

</div>
}

</div>


<button
type='submit'
className='plasmo-bg-secondary plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'
>
  Send Transaction
</button>
    </form>
  }

  {!isLoading && !isSuccess && watch('receiverAddress') && watch('receiverAddress').trim().length === 42 && watch('tokenAmountToBeSent') > 0 && 
      <form className='
    plasmo-w-full
    plasmo-flex plasmo-flex-col plasmo-gap-4
    plasmo-h-screen plasmo-overflow-auto' onSubmit={handleSubmit(handleFinalTransaction, (err)=>{
      console.log(err);
      alert(err.erc20TokenAddress ? err.erc20TokenAddress.message : err.tokenAmountToBeSent ? err.tokenAmountToBeSent.message : 'Error in form submission' );
    })}>
    <p
className='plasmo-text-secondary plasmo-font-semibold plasmo-text-lg
'>
  Transaction Summary (ERC20 / Native)
</p>


<div className="plasmo-flex plasmo-flex-col gap-2 plasmo-w-full plasmo-items-center plasmo-justify-center">
  <div className="plasmo-bg-accent plasmo-p-2 plasmo-rounded-lg plasmo-w-full">
    <p className='plasmo-text-secondary plasmo-font-semibold plasmo-text-lg'>From</p>
    <p className='plasmo-text-white plasmo-font-light plasmo-line-clamp-1'>{publicAddress}</p>
  </div>
<FaArrowDown/>
<div className="plasmo-bg-accent plasmo-p-2 plasmo-rounded-lg plasmo-w-full">
  <p className='plasmo-text-secondary font-semibold plasmo-text-lg'>To</p>
  <p className='plasmo-text-white plasmo-font-light plasmo-line-clamp-1'>{watch('receiverAddress') || nftWatch('receiverAddress')}</p>
</div>
</div>


<div className="plasmo-bg-accent plasmo-px-2 plasmo-py-4 plasmo-rounded-lg plasmo-text-white plasmo-w-full plasmo-flex plasmo-justify-between plasmo-items-center">
  <p>Network</p>

  <p>{currentNetworkName}</p>
</div>



<div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-full">
<p className='plasmo-text-white'>Speed Of Tranasaction</p>
{gasFeesOptions &&
<div onClick={()=>console.log(gasFeesOptions)} className="plasmo-w-full plasmo-grid plasmo-grid-cols-3 plasmo-items-center plasmo-gap-2">

{Object.values(gasFeesOptions).map((element, index)=>(
<button 
key={index}
onClick={(e)=>{
  e.preventDefault();
  setGasOption(element);
  console.log(selectedGasOption);
}} className={`${selectedGasOption && Number((element as any).maxFeePerGas) === Number(selectedGasOption.maxFeePerGas) ? 'plasmo-bg-secondary/70 plasmo-border-accent plasmo-border-2' : 'plasmo-bg-accent'} plasmo-p-3 plasmo-rounded-lg plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-items-center plasmo-justify-center`}>
<p className='plasmo-text-sm plasmo-text-white'>{
  index === 0 ? 'Slow' : index === 1 ? 'Medium' : 'Fast'
  }</p>

{ index === 0 &&
<GiSloth className={`${selectedGasOption && Number((element as any).maxFeePerGas) === Number(selectedGasOption.maxFeePerGas) ? 'plasmo-text-accent' : 'plasmo-text-secondary'}`}/>
}

{index === 1 && 
<LuBatteryMedium className={`${selectedGasOption &&  Number((element as any).maxFeePerGas) === Number(selectedGasOption.maxFeePerGas) ? 'plasmo-text-accent' : 'plasmo-text-secondary'}`}/>
}

{index === 2 && 
<MdFastfood className={`${selectedGasOption &&  Number((element as any).maxFeePerGas) === Number(selectedGasOption.maxFeePerGas) ? 'plasmo-text-accent' : 'plasmo-text-secondary'}`}/>
}

</button>
))}

</div>
}

</div>


<button
type='submit'
className='plasmo-bg-secondary plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'
>
  Send Transaction
</button>
    </form>
  }

  </>
  )
}

export default TransactionSummary