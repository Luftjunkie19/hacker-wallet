import React from 'react'
import Actions from '~popup/component/Actions'
import NativeTokenAmount from '~popup/component/NativeTokenAmount'
import WalletTabs from '~popup/component/WalletTabs'

type Props = {}

function Home({}: Props) {
  return (
    <div
    className=' plasmo-h-full plasmo-w-full plasmo-p-3
    '>

<NativeTokenAmount/>

<Actions/>

<WalletTabs/>

    </div>
  )
}

export default Home