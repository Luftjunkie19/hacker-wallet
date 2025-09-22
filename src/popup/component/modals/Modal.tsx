import React, { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { MdCancel } from 'react-icons/md';



function Modal({children, title}:{children:React.ReactNode, title:string}) {
const [isModalOpen, setIsModalOpen]=useState<boolean>();

    return (
    <div className='plasmo-flex plasmo-z-20 plasmo-gap-2 plasmo-p-2 plasmo-w-full plasmo-justify-between plasmo-items-center'>
    <p className='plasmo-text-white'>{title}</p>

    <button className='plasmo-text-secondary hover:plasmo-text-white' onClick={()=>setIsModalOpen(true)}>
        <FaPlusCircle/>
    </button>

{isModalOpen && <div className='plasmo-bg-accent/80 plasmo-absolute plasmo-flex plasmo-flex-col plasmo-gap-3
plasmo-top-0 plasmo-left-0 plasmo-w-full plasmo-h-full plasmo-rounded-lg plasmo-p-2'>
    <button onClick={()=>setIsModalOpen(false)} className='plasmo-text-red-500 plasmo-self-end'>
        <MdCancel size={24}/>
    </button>

{children}



    </div>}

    </div>
  )
}

export default Modal