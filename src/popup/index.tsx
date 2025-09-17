import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import UnloggedScreen from './UnloggedScreen'
import RestoreWallet from './RestoreWallet'
import CreateNewWallet from './CreateNewWallet'
import { Theme } from '@radix-ui/themes'

type Props = {}

function IndexRouterPopup({}: Props) {
  return (
    <Theme>
    <div className="plasmo-p-4 plasmo-flex  plasmo-items-center plasmo-flex-col plasmo-gap-8 plasmo-bg-primary plasmo-min-w-96 plasmo-h-[36rem]">
<div className="plasmo-flex plasmo-gap-4 plasmo-flex-col plasmo-justify-center plasmo-items-center">
           <div className="self-center">
              <img src='./icon.png' width={40} height={40} className="plasmo-w-12 plasmo-h-12 plasmo-rounded-lg" alt="HackerWallet Logo" />
      </div>
        <p className="plasmo-text-2xl plasmo-text-center plasmo-font-bold plasmo-text-secondary">
        HackerWallet
      </p>
      </div>

<MemoryRouter>
    <Routes>
      <Route  path="/" element={<UnloggedScreen />} />
      <Route path="/restore" element={<RestoreWallet />} />
      <Route path="/create-new" element={<CreateNewWallet />} />
    </Routes>
</MemoryRouter>
    </div>
    </Theme>
  )
}

export default IndexRouterPopup