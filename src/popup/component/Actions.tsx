import {QRCode} from "react-qrcode-logo";
import React, { useState } from 'react'

import { BiTransfer } from "react-icons/bi";
import { MdCallReceived, MdCancel } from "react-icons/md";
import { useAppDispatch, useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { FaClipboard } from "react-icons/fa";
type Props = {}

function Actions({}: Props) {

  const publicAddress=useAppSelector((selector)=>selector.loggedIn.address);
  const [openReceive, setOpenReceive]=useState<boolean>(false);

  return (
    <div
    className='
    plasmo-py-4 plasmo-flex plasmo-items-center
    plasmo-gap-6 plasmo-w-full'>
    
    <button className='
    plasmo-bg-secondary/70 plasmo-rounded-lg plasmo-w-16 plasmo-h-14 plasmo-flex-col plasmo-items-center plasmo-flex
    plasmo-justify-center
    '>
        <BiTransfer
        className='
        plasmo-text-2xl
        '
        />
        <p
        className='
        plasmo-font-semibold plasmo-text-sm
        '
        >Send</p>
    </button>
    
    <button 
    onClick={()=>{
      setOpenReceive(true);
    }}
    className='
    plasmo-bg-secondary/70 plasmo-rounded-lg plasmo-w-16 plasmo-h-14 plasmo-flex-col plasmo-items-center plasmo-flex
    plasmo-justify-center
    '>
    <MdCallReceived
      className='
        plasmo-text-2xl
        '
    />
    <p
     className='
        plasmo-font-semibold plasmo-text-sm
        '
    >Receive</p>
    </button>

    { openReceive &&
    <div
    className={` plasmo-transition-all ${openReceive ? 'plasmo-opacity-100' : 'plasmo-opacity-0'} plasmo-duration-700 plasmo-delay-300
   plasmo-absolute plasmo-top-8 plasmo-left-0 plasmo plasmo-w-full
    plasmo-h-4/5 plasmo-p-3
   plasmo-bg-accent/90
   plasmo-rounded-2xl
   plasmo-flex plasmo-flex-col plasmo-gap-6
   `}
    >

      <button
      className="
      plasmo-text-white plasmo-self-end plasmo-text-2xl
      "
      onClick={()=>{
        setOpenReceive(false);
      }}
      >
        <MdCancel/>
      </button>

<div className="
plasmo-self-center
plasmo-bg-white plasmo-rounded-lg plasmo-p-2
">
<QRCode
logoImage={
  require('../icon.png')
}
size={200}
value={publicAddress}
/>
</div>
<p className="
plasmo-text-secondary
 plasmo-text-center
">
 {publicAddress}
</p>

<button
className="plasmo-text-secondary plasmo-self-center
plasmo-flex plasmo-items-center plasmo-gap-2"
onClick={
  ()=>{
    navigator.clipboard.write(publicAddress);
  }
}
>
  Copy Address <FaClipboard/>
</button>
    </div>
    }


    
    </div>
  )
}

export default Actions