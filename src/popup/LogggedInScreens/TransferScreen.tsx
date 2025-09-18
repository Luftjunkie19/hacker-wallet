import React from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper'

type Props = {}

function TransferScreen({}: Props) {
  const publicAddress= useAppSelector((state)=>state.loggedIn.address);
  
  return (
    <div>
      
      <div className="plasmo-m-3 plasmo-p-2 plasmo-bg-accent plasmo-border plasmo-rounded-lg plasmo-border-secondary">

    <div className="plasmo-w-12 plasmo-h-12 plasmo-rounded-full plasmo-bg-orange-500"></div>

    <p className='plasmo-text-white'>{publicAddress}</p>

      </div>

      
    </div>
  )
}

export default TransferScreen