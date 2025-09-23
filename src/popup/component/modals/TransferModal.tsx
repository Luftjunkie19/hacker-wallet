import React from 'react'
import { MdCancel } from 'react-icons/md'

type Props = {
    setCloseModal:()=>void,
    children:React.ReactNode
}

function TransferModal({setCloseModal, children}: Props) {
  return (
<div className='plasmo-bg-accent/80 plasmo-absolute plasmo-flex plasmo-flex-col plasmo-gap-3
plasmo-top-0 plasmo-left-0 plasmo-w-full plasmo-h-full plasmo-rounded-lg plasmo-p-2'>
    <button onClick={(e)=>{
e.preventDefault();
setCloseModal();
    }} className='plasmo-text-red-500 plasmo-self-end'>
        <MdCancel size={24}/>
    </button>

{children}

    </div>
  )
}

export default TransferModal