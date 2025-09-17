import { Button, TextArea } from '@radix-ui/themes'
import React from 'react'

type Props = {}

function RestoreWallet({}: Props) {
  return (
    <div className='plasmo-w-full
plasmo-flex plasmo-flex-col plasmo-gap-3
    '>
<p
className='plasmo-text-base plasmo-font-semibold plasmo-text-secondary'
>Enter your recovery phrase:</p>
<TextArea
placeholder='Recovery phrase...'
className='plasmo-h-24'
/>
<button
className="plasmo-bg-secondary flex plasmo-items-center plasmo-text-center plasmo-justify-center plasmo-border  plasmo-border-accent
        plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-2 plasmo-text-primary
         hover:plasmo-border-secondary hover:plasmo-text-white
         hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500
         
         "
>
    Restore Wallet
</button>

    </div>
  )
}

export default RestoreWallet