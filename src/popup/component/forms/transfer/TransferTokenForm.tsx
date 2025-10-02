import React, { useCallback, useEffect, useState } from 'react'
import { fetchContainingKeywordElements } from '~popup/IndexedDB/WalletDataStorage';
import {useFormContext} from 'react-hook-form';
import * as z from 'zod';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { DropdownMenu } from 'radix-ui';
import { RiTokenSwapFill } from 'react-icons/ri';
import { ethers } from 'ethers';
import TransferModal from '~popup/component/modals/TransferModal';
import useFetchTokensData from '~popup/hooks/useFetchTokensData';
import useFetchNftData from '~popup/hooks/useFetchNftData';
import { erc721Abi } from '~popup/abis/ERC721';
import { erc20Abi } from '~popup/abis/ERC20';
import { SiOpensea } from 'react-icons/si';
import { Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';

type Props = {
  maxAmountToSend:number, 
  setMaxAmountToSend:(input:number)=>void,
  setCurrentStep:(input:number)=>void,
  setPassword:(input:string)=>void,
  password:string,
  setGasFeesOptions:(input:any)=>void,
  tokenType:'ERC20' | 'NFT',
  setTokenType:(input:'ERC20' | 'NFT')=>void
}



function TransferTokenForm({maxAmountToSend, tokenType, setTokenType, setMaxAmountToSend, setCurrentStep, setPassword, password, setGasFeesOptions}: Props) {
    // Imported NFTs
    const [importedNfts, setImportedNfts]=useState<any[]>([]);  
    const publicAddress = useAppSelector((state)=>state.loggedIn.address);
    const currentNetworkNativeTokenSymbol= useAppSelector((state)=>state.currentNetworkConnected.currencySymbol);
    const [isLoading, setIsLoading]=useState<boolean>(false);
    const [openModal, setOpenModal]=useState<boolean>(false);
    const {tokens}=useFetchTokensData();
    const {elements:nftElements}=useFetchNftData();
    const encryptedPrivatKey= useAppSelector((state)=>state.loggedIn.encryptedWallet);
    const rpcURL=useAppSelector((state)=>state.currentNetworkConnected.rpcURL);
    const passwordOfSession = useAppSelector((state)=>state.loggedIn.password);
    
    const fetchERC721s= useCallback(async ()=>{
        const elements= await fetchContainingKeywordElements();
        
        setImportedNfts((elements as unknown as any[]).filter((element)=> typeof element.nftAddress === 'string' ));
    },[]);
    
    useEffect(()=>{
        fetchERC721s();
    },[fetchERC721s]);
    
    const zodERC20TxSchema= z.object({
    erc20TokenAddress: z.string().startsWith("0x",{'error': 'Invalid ERC20 Token Address !'}).length(42, {'error':'Invalid length of the contract address'}).nullish().optional(),
    receiverAddress: z.string().startsWith("0x",{'error': 'Invalid Receiver Address !'}).length(42, {'error':'Invalid length of receiver contract'}),
    tokenAmountToBeSent: z.number({'error':'Invalid type'}).lte(maxAmountToSend, {'error':'The provided number is larger than the all possible amount.'}).gt(0, {'error':'Has to be greater than 0.'})
    }).required({receiverAddress:true, tokenAmountToBeSent:true});

    const zodNFTTxSchema= z.object({
      nftTokenAddress: z.string().startsWith("0x",{'error': 'Invalid ERC20 Token Address !'}).length(42, {'error':'Invalid length of the contract address'}),
      receiverAddress: z.string().startsWith("0x",{'error': 'Invalid Receiver Address !'}).length(42, {'error':'Invalid length of receiver contract'}),
      tokenId: z.bigint({'error':'Invalid type of tokenId provided'}).positive({'error':"Invalid value of tokenId."})
    }).required({receiverAddress:true, tokenId:true, nftTokenAddress:true});
    

    const {register, reset, watch, setValue, trigger, formState }= useFormContext<z.infer<typeof zodERC20TxSchema>>();

    const {register:nftRegister, reset:nftReset, watch:nftWatch, setValue:nftSetValue, trigger:nftTrigger, formState:nftFormState}=useFormContext<z.infer<typeof zodNFTTxSchema>>();
   


  const SPEEDS = {
    slow:  { tipMultiplier: 0.5, baseFeeMultiplier: 0.0 }, // low tip, no bump
    medium:{ tipMultiplier: 1.0, baseFeeMultiplier: 0.1 }, // normal tip, small base bump
    fast:  { tipMultiplier: 1.5, baseFeeMultiplier: 0.25 } // higher tip, larger base bump
  };
  


      const getGasFee= async ()=>{
        try {


 const isNotContractTx=!watch('erc20TokenAddress') && !nftWatch('nftTokenAddress');
const isNFT = nftWatch('nftTokenAddress') && nftWatch('nftTokenAddress').trim().length !== 0;
console.log({isNotContractTx, isNFT});

        const isValid= await bcrypt.compare(password, passwordOfSession);

        if(!isValid){
          alert('Invalid Password !');
          throw new Error("Invalid Password !");
        }

          const provider = new ethers.JsonRpcProvider(rpcURL);
    
          const walletToDecrypt= await ethers.Wallet.fromEncryptedJson(encryptedPrivatKey, password);

          if(!walletToDecrypt){
            alert('Something went wrong with action authentication.');
            throw new Error("Couldn't decrypt the wallet with the provided password");
          }

          const decryptedWallet = new ethers.Wallet(walletToDecrypt.privateKey, provider);
    
          console.log(decryptedWallet);
    
        const block = await provider.getBlock("latest");
    
    
        const gasFeeBase= block.baseFeePerGas;
    
        if(!gasFeeBase) {
alert('Something went wrong with gas estimation');
          throw new Error("Provider does not serve with the base of gas fee");
        }


        if(!isNotContractTx){
        let contract:ethers.Contract;
        if(isNFT){
          const nftInterface = new ethers.Interface(erc721Abi);
          contract = new ethers.Contract(nftWatch('nftTokenAddress'), nftInterface, decryptedWallet);

         const approvalTx = await contract.approve(nftWatch('receiverAddress'), BigInt(nftWatch('tokenId')));

          const approvalReceipt = await approvalTx.wait();

          console.log(approvalReceipt);

          if(!approvalReceipt){
  alert('Something went wrong with approval of NFT');
            return;
          }
    
              console.log(contract.interface.getFunction('safeTransferFrom'), 'function exists');
    const contractAddr= await contract.getAddress();
    const data = contract.interface.encodeFunctionData("safeTransferFrom", [publicAddress, watch('receiverAddress'), BigInt(nftWatch('tokenId'))]);
    const populatedTransaction:ethers.TransactionRequest = { to: contractAddr,from: publicAddress, data };
    
    
          const estimateGas= await decryptedWallet.estimateGas(populatedTransaction);
    
    
          const gasLimit = BigInt(estimateGas) * 105n / 100n; // add 5% buffer
    
      // 3. fee data
      const block = await provider.getBlock("latest");
      if (!block?.baseFeePerGas) {
        throw new Error("Network doesn't expose baseFee (not EIP-1559)");
      }
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
    setGasFeesOptions(out);
      setIsLoading(false);
          setCurrentStep(1);
          setOpenModal(false);
        }
    
        console.log('ERC20 starts');

        
          const erc20Interface = new ethers.Interface(erc20Abi);
          contract = new ethers.Contract(watch('erc20TokenAddress'), erc20Interface, decryptedWallet);
    
    
          const decimals = await contract.decimals();
    
          console.log(decimals);
    
          if(!decimals){
            alert("There are no decimals of the token");
            throw new Error("Token doesn't have any decimals");
      
          }

          console.log(Number(watch('tokenAmountToBeSent')) * (10 ** Number(decimals)), Number(watch('tokenAmountToBeSent')) * (10 ** Number(decimals)) / (10 ** Number(decimals)) );          

          const contractAddr= await contract.getAddress();
    
          const amountToBeSentInNumber= Number(watch('tokenAmountToBeSent')) * (10 ** Number(decimals));
          
          const amountToBeSent= BigInt(amountToBeSentInNumber);

          console.log(amountToBeSent, decimals, amountToBeSentInNumber);
          

          const data = contract.interface.encodeFunctionData("transfer", [watch('receiverAddress'), amountToBeSent]);

          console.log(data, 'data for transfer');

          const populatedTransaction:ethers.TransactionRequest = { to: contractAddr, from: publicAddress, data };
    
          console.log(populatedTransaction);
    
          
          const estimateGas= await decryptedWallet.estimateGas(populatedTransaction);

          if(!estimateGas){
            alert('Something went wrong with gas estimation');
            throw new Error("Gas estimation failed");
          }

          console.log(estimateGas, 'gas estimate');
    
    
          const gasLimit = BigInt(estimateGas) * 102n / 100n; // add 2% buffer
    
      // 3. fee data
      const block = await provider.getBlock("latest");
      if (!block?.baseFeePerGas){
        alert('Something went wrong with gas estimation');
        throw new Error("Network doesn't expose baseFee (not EIP-1559)");

      } 
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
    
                setGasFeesOptions(out);
                  setIsLoading(false);
          setCurrentStep(1);
          setOpenModal(false);
        }
    
   
          const txForEstimation={from:publicAddress, to:watch('receiverAddress'), value: BigInt(watch('tokenAmountToBeSent') * (10 ** 18))};
    
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
      
     setGasFeesOptions(suggestions);
          setIsLoading(false);
          setCurrentStep(1);
          setOpenModal(false);
    
    
        } catch (error) {
          console.log(error);
          alert(error);
        }
      }
    
    
      const moveToTransactionsSummary =  async ()=>{
       try {
             setIsLoading(true);
       
        if(watch('tokenAmountToBeSent')){
          setValue('tokenAmountToBeSent', Number(watch('tokenAmountToBeSent')));
        }

       if(nftWatch('tokenId')) {
        nftSetValue('tokenId', BigInt(nftWatch('tokenId')));
}

       console.log(watch('tokenAmountToBeSent'), nftWatch('tokenId'));
        
         if(watch('tokenAmountToBeSent') && maxAmountToSend && (maxAmountToSend < watch('tokenAmountToBeSent') || watch('tokenAmountToBeSent') === 0)){
          alert("You are not able to send the provided amount");
         setIsLoading(false);
          return;
        }
    
        if( (nftWatch('receiverAddress').length !== 42 && !nftWatch('receiverAddress').startsWith('0x')) ||  (watch('receiverAddress').length !== 42 && !watch('receiverAddress').startsWith("0x"))){
          alert("You haven't provided a valid address");
          setIsLoading(false);
          return;
        }

        await getGasFee();


    
       } catch (error) {
        alert(error);
        console.log(error);
      setIsLoading(false); 
      }
      
      }
    




  return (
    <div className='
    plasmo-w-full
    plasmo-flex plasmo-flex-col plasmo-gap-4
    plasmo-h-screen plasmo-overflow-auto'>

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
<button onClick={(e)=>{
  e.preventDefault();
  nftReset();
  setTokenType("ERC20");

  }} className={`plasmo-rounded-lg plasmo-p-2 ${tokenType === "ERC20" ? "plasmo-bg-accent plasmo-text-secondary hover:plasmo-bg-secondary/70 hover:plasmo-text-accent" : "plasmo-text-accent plasmo-bg-secondary hover:plasmo-bg-secondary/70"} hover:plasmo-scale-95 plasmo-transition-all`}>
  ERC20s/Native Token
</button>
<button onClick={(e)=>{
   e.preventDefault();
reset();
console.log(nftElements);
  setTokenType('NFT');
}} className={` plasmo-rounded-lg plasmo-p-2 ${tokenType === "NFT" ? "plasmo-bg-accent plasmo-text-secondary hover:plasmo-bg-secondary/70 hover:plasmo-text-accent" : "plasmo-text-accent plasmo-bg-secondary hover:plasmo-bg-secondary/70"} hover:plasmo-scale-95 plasmo-transition-all`}>
  NFTs
</button>
  </div>
</div>

{tokenType === 'ERC20' && 
<>
<div className="plasmo-flex plasmo-gap-2">
  <input
  disabled={maxAmountToSend === 0}
  {...register('tokenAmountToBeSent')}
  onChange={(e)=>{
    
    setValue('tokenAmountToBeSent', Number(e.target.value));
  }}
  step="0.001"
  min={0}
type='number'
  max={maxAmountToSend}
  placeholder='Amount to be sent'
  className='plasmo-bg-accent
  plasmo-w-full disabled:plasmo-opacity-50
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
                    key={index}
                    id={element.tokenAddress}
            className={`
            plasmo-text-white plasmo-flex plasmo-items-center plasmo-gap-2
            plasmo-cursor-pointer
            ${watch('erc20TokenAddress') === element.tokenAddress ? "plasmo-bg-primary plasmo-p-2 plasmo-rounded-lg" :
             ""}
            `}
            onClick={(e)=>{
               e.preventDefault();
              console.log(element);

              const decimals = element.tokenMetadata.decimals ?? 10 ** 18


              setMaxAmountToSend(element.tokenBalance / decimals);
              setValue('erc20TokenAddress', element.tokenAddress);
            }}
            >

<p
className='
plasmo-font-semibold
'
>
{
(Number(element.tokenBalance) / (10 ** (element.tokenMetadata.decimals ?? 18))).toFixed(4)
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

<p className='plasmo-text-sm plasmo-font-light plasmo-text-white'>Max Amount: <span className='plasmo-text-secondary plasmo-font-bold'>
  {(maxAmountToSend).toFixed(4)}
  </span>
  </p>
</>
}

{tokenType === 'NFT' &&
<div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-border-t plasmo-border-secondary plasmo-pt-4 ">
{nftElements && nftElements.length > 0 && <>
{nftElements.map((element)=>(
  
    <div onClick={(e)=>{
       e.preventDefault();
       nftSetValue('nftTokenAddress', element.contractAddress);
       nftSetValue('tokenId', BigInt(element.tokenId));
       console.log(nftWatch('tokenId'));
}}

className={`plasmo-flex plasmo-gap-4 ${Number(nftWatch('tokenId')) === Number(element.tokenId) ? "plasmo-bg-accent plasmo-border-secondary" : "plasmo-bg-accent plasmo-border-primary"} plasmo-border plasmo-rounded-lg
plasmo-justify-between plasmo-items-center plasmo-p-3 plasmo-text-white plasmo-cursor-pointer`}>
<img
src={require('../../../icon.png')}
width={32}
height={32}
className='plasmo-w-8 plasmo-h-8 plasmo-rounded-lg
plasmo-border-secondary plasmo-border
'
alt={`${element.tokenId}`}
/>

<div className="
plasmo-flex plasmo-flex-col plasmo-gap-1 plasmo-w-full">
  <p
  className='
  plasmo-text-white plasmo-text-xs plasmo-text-wrap plasmo-line-clamp-1 plasmo-font-light'>
    {element.contractAddress.substring(0,6)}...{element.contractAddress.substring(element.contractAddress.length - 4)}
  </p>

</div>

<p
className='plasmo-text-secondary plasmo-font-bold plasmo-text-xs'>
#{Number(element.tokenId)}
</p>

</div>
))}
</>}


{importedNfts.length > 0 && importedNfts.map((
  element
)=>(
  <div onClick={(e)=>{
     e.preventDefault();
    nftSetValue('nftTokenAddress',element.nftAddress);
    nftSetValue('tokenId', BigInt(element.tokenId));
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
{...(tokenType === 'ERC20' ? register('receiverAddress') : nftRegister('receiverAddress'))}
  type='text'
  placeholder='Destination/Receiver Address'
  className='plasmo-bg-accent
  plasmo-w-full
  plasmo-p-2 plasmo-rounded-lg plasmo-border plasmo-border-secondary plasmo-text-white'/>


  </div>


<button
className='plasmo-bg-secondary plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'
onClick={(e)=>{
  e.preventDefault();
  if(tokenType === 'ERC20'){
           trigger(); 
           console.log(formState.errors);
          if(Object.values(formState.errors).find((item)=>item.message.trim() !== '')){
            alert(`There are following errors occuring: \n
              ${Object.values(formState.errors).filter((item)=>item.message.trim() !== '').map((item)=>`${item.message}\n`)}
              `)
            return
          }
          }else{
            nftTrigger(); 
             if(Object.values(nftFormState.errors).find((item)=>item.message.trim() !== '')){
            alert(`There are following errors occuring: \n
              ${Object.values(nftFormState.errors).filter((item)=>item.message.trim() !== '').map((item)=>`${item.message}\n`)}
              `)
            return
          }
          }
  setOpenModal(true);
}}
>
  Approve
</button>

{openModal && <TransferModal setCloseModal={()=>{
  setOpenModal(false);
  }}>
    {isLoading ? <div className='plasmo-flex plasmo-w-full plasmo-h-full plasmo-items-center plasmo-justify-center'>

<p className='plasmo-text-secondary plasmo-text-lg plasmo-font-bold'>Loading...</p>

    </div> :    
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
onClick={async (e)=>{
  e.preventDefault();
  await moveToTransactionsSummary();
}}
className='plasmo-bg-secondary plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'
>
  Summarize the Transaction
</button>

  </div>
    }

  
  </TransferModal>}
    </div>
  )
}

export default TransferTokenForm