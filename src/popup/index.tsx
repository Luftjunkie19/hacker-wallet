import React from 'react'
import { Theme } from '@radix-ui/themes'
import ReduxWrapper from './state-managment/ReduxWrapper'
import Router from './state-managment/Router'

type Props = {}

function IndexRouterPopup({}: Props) {

  return (
    <Theme>
    <div className="plasmo-p-4 plasmo-flex  plasmo-items-center plasmo-flex-col plasmo-gap-8 plasmo-bg-primary plasmo-min-w-96 plasmo-h-[36rem]">
<ReduxWrapper>

  <Router/>
</ReduxWrapper>
    </div>
    </Theme>
  )
}

export default IndexRouterPopup