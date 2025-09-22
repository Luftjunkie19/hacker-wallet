import {QRCode} from "react-qrcode-logo";
import React, { useState } from 'react'

import { BiTransfer } from "react-icons/bi";
import { MdCallReceived, MdCancel } from "react-icons/md";
import {  useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { FaClipboard } from "react-icons/fa";
import { Link } from "react-router-dom";
import QRCodeModal from "./modals/QRCodeModal";
type Props = {}

function Actions({}: Props) {
  const publicAddress=useAppSelector((selector)=>selector.loggedIn.address);
  const [openReceive, setOpenReceive]=useState<boolean>(false);

  return (
    <div
    className='
    plasmo-py-4 plasmo-flex plasmo-items-center
    plasmo-gap-6 plasmo-w-full'>
    
    <Link 
    to={'/transfer'}
    className='
    plasmo-bg-secondary/70 plasmo-rounded-lg plasmo-w-16 plasmo-h-14 plasmo-flex-col plasmo-items-center plasmo-flex
    plasmo-justify-center
    '
    >
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
    </Link>
    
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
  <QRCodeModal setOpenReceive={() => setOpenReceive(false)} openReceive={openReceive} publicAddress={publicAddress}  />
    }


    
    </div>
  )
}

export default Actions