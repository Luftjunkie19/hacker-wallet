import React from 'react'
import { FaClipboard } from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';
import QRCode from 'react-qrcode-logo';

type Props = {openReceive:boolean, 
    publicAddress:`0x${string}`,
    setOpenReceive:()=>void}

function QRCodeModal({openReceive, publicAddress, setOpenReceive}: Props) {
  return (
  <div
    className={`plasmo-transition-all ${openReceive ? 'plasmo-opacity-100' : 'plasmo-opacity-0'} plasmo-duration-700 plasmo-delay-300
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
        setOpenReceive();
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
  require('../../icon.png')
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
    navigator.clipboard.writeText(publicAddress);
  }
}
>
  Copy Address <FaClipboard/>
</button>
    </div>
  )
}

export default QRCodeModal