import React from 'react'
import { FaEye } from 'react-icons/fa';
import { IoEyeOff } from 'react-icons/io5';
import Modal from '~popup/component/modals/Modal';

type Props = {
    nextStep:boolean,
    setTokenAddress:(input:`0x${string}`)=>void,
    tokenAddress:`0x${string}`,
    setTokenId:(input:BigInt)=>void,
    setNextStep:(state:boolean)=>void,
    password:string,
    setPassword:(input:string)=>void,
    inputType: 'text' | 'password',
    setInputType: (input:'text'|'password')=>void
    handleLoadCheckOwnership: ()=>Promise<void>
}

function LoadYourNFTModal({nextStep, tokenAddress, setInputType, setNextStep, 
    setPassword, 
    setTokenAddress,
    password,
    handleLoadCheckOwnership,
    setTokenId, inputType
}: Props) {
  return (
    <Modal title='Load Your NFT (ERC721)'>
  <div className='plasmo-flex plasmo-flex-col plasmo-h-full plasmo-gap-3 plasmo-p-2'>
{!nextStep &&
<>
<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
  <p className='plasmo-text-white'>Token Address</p>
  <input
onChange={(e) => {
  setTokenAddress(e.target.value as `0xstring`);
}}
value={tokenAddress}
placeholder='Token Address...'
className='plasmo-bg-accent plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>
</div>


<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
  <p className='plasmo-text-white'>Token Id</p>
  <input
  type='number'
onChange={(e) => {
  setTokenId(BigInt(+e.target.value));
}}
step={1}
min={1}
placeholder='Token ID...'
className='plasmo-bg-accent plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>



</div>

<button 
onClick={()=>setNextStep(true)}
className='plasmo-bg-secondary plasmo-mt-6 plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'

>Confirm</button>
</>
}

{nextStep && <>
<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
 
 <div className="plasmo-flex plasmo-gap-2 plasmo-items-center">
 <div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-full">
  <p className='plasmo-text-white'>Password</p>
  <input
  type={inputType}
onChange={(e) => {
  setPassword(e.target.value);
}}
value={password}
placeholder='Enter Password To Confirm...'
className='plasmo-bg-accent plasmo-w-full plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>
 </div>

<div onClick={()=>{
  if(inputType === 'text'){
    setInputType('password');
    return;
  }
  setInputType('text');
}} className='plasmo-text-secondary plasmo-text-2xl'>
{inputType === 'text' ? <IoEyeOff/> : <FaEye/>}  
</div>  
 </div>

</div>
<button 
onClick={handleLoadCheckOwnership}
className='plasmo-bg-secondary plasmo-self-center plasmo-w-full plasmo-mt-6 plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'

>Confirm</button>
</>}

  </div>
</Modal>
  )
}

export default LoadYourNFTModal