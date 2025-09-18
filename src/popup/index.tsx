import React from 'react'
import { Theme } from '@radix-ui/themes'
import ReduxWrapper from './state-managment/ReduxWrapper'

import Router from './state-managment/Router'
import Header from './component/Header'

type Props = {}

function IndexRouterPopup({}: Props) {

  return (
    <Theme>
    <div className="plasmo-p-4 plasmo-flex  plasmo-items-center plasmo-flex-col plasmo-gap-8 plasmo-bg-primary plasmo-min-w-96 plasmo-h-[36rem]">
<ReduxWrapper>
<Header/>
  <Router/>
</ReduxWrapper>
    </div>
    </Theme>
  )
}

export default IndexRouterPopup