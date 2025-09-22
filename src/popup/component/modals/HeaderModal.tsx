import React from 'react'
import TransferModal from './TransferModal';
import { FaClipboard } from 'react-icons/fa';

type Props = {
    closeModalEntirely:()=>void,
    setPassword:(input:string)=>void,
    password:string,
    accountDetails:any,
    handleGetAccountDetails:()=>Promise<void>
}

function HeaderModal({closeModalEntirely, setPassword, password, accountDetails, handleGetAccountDetails}: Props) {
  return (
<TransferModal setCloseModal={closeModalEntirely}>
  {!accountDetails && <>
  
       <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
  <p className='plasmo-text-white'>Password</p>
  <input
onChange={(e) => {
  setPassword(e.target.value);
}}
value={password}
placeholder='Enter Password...'
className='plasmo-bg-accent plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>
</div>


<button 
onClick={handleGetAccountDetails}
className='plasmo-bg-secondary plasmo-mt-6 plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'

>Confirm</button>

  </>}

  {accountDetails && <>
<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
  <p className='plasmo-text-secondary plasmo-text-lg plasmo-font-semibold'>Private Key:</p>
  <p className='plasmo-text-white'>{accountDetails.privateKey}</p>
  <button className='plasmo-flex plasmo-text-white plasmo-items-center plasmo-gap-2' onClick={()=>navigator.clipboard.writeText(accountDetails.privateKey)}>Copy Private Key <FaClipboard className='plasmo-text-secondary'/></button>
</div>

<div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-full">
    <p className='plasmo-text-secondary plasmo-text-lg plasmo-font-semibold'>Mnemonic:</p>
<div className="plasmo-grid plasmo-w-full plasmo-grid-cols-4 plasmo-gap-2">
 {accountDetails.mnemonic.split(" ").map((word)=>(<div className='plasmo-bg-primary plasmo-text-center plasmo-p-1 plasmo-text-sm plasmo-text-secondary plasmo-rounded-lg' id={word}>{word}</div>))}
</div>
   <button className='plasmo-flex plasmo-items-center plasmo-text-white plasmo-gap-2' onClick={()=>navigator.clipboard.writeText(accountDetails.mnemonic)}>Copy Mnemonic <FaClipboard className='plasmo-text-secondary'/></button>
</div>

  </>}
  

        </TransferModal>
  )
}

export default HeaderModal