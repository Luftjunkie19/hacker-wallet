import React from 'react'
import Actions from '~popup/component/Actions'
import WalletTabs from '~popup/component/WalletTabs'

type Props = {}

function Home({}: Props) {
  return (
    <div
    className=' plasmo-h-full plasmo-w-full plasmo-p-3
    '>

<p
className='
plasmo-text-secondary plasmo-text-3xl plasmo-font-bold
'
>
    100.00$
</p>

<Actions/>

<WalletTabs/>

    </div>
  )
}

export default Home