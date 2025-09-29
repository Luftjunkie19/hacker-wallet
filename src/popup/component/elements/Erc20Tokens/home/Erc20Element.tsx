import React from 'react'
import { FaClipboard } from 'react-icons/fa'

type Props = {
    tokenAddress:`0x${string}`,
    tokenName:string,
    symbol:string,
    tokenAmount:string
}

function Erc20Element({tokenAddress, tokenName, symbol, tokenAmount}: Props) {
  return (
(<div id={`${tokenAddress}-${symbol}`} className='plasmo-w-full plasmo-bg-accent plasmo-p-2 plasmo-rounded-lg plasmo-flex plasmo-items-center plasmo-justify-between'>
        <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
    <p className='plasmo-text-white plasmo-line-clamp-1'>{tokenName ?? "Ether"}  ({symbol ?? "ETH"})</p>
    <button onClick={()=>navigator.clipboard.writeText(tokenAddress)} className='plasmo-text-sm plasmo-w-fit plasmo-p-1 plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-secondary'>
    <FaClipboard />
        Copy address
        </button>
        </div>

<div>
    <p className='plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-white plasmo-font-semibold'>{tokenAmount} <span className='plasmo-text-secondary'>{symbol ?? "ETH"}</span></p>
</div>

     </div>)
  )
}

export default Erc20Element