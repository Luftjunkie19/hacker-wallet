import React from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper'

type Props = {
    index:number,
    element:any
}

function LoadedNFTElement({
    index,
    element
}: Props) {
    const blockExplorerURL=useAppSelector((selector)=>selector.currentNetworkConnected.blockExplorerURL);

    const chromeContractRedirection=()=>{
console.log(
    element
);

        chrome.tabs.create(
            {
                url:`${blockExplorerURL}/${element.contractAddress}`
            }
        )
    }


  return (
<>
<div
onClick={chromeContractRedirection}
id={`${ crypto.randomUUID()
}`} className='plasmo-w-24 plasmo-cursor-pointer plasmo-relative plasmo-top-0 plasmo-left-0 plasmo-h-24 plasmo-rounded-lg'>
      <img src={``} height={64} width={64} className='plasmo-w-full plasmo-rounded-lg plasmo-h-full'/>

      <div className="plasmo-absolute plasmo-p-1 plasmo-bottom-0 plasmo-left-0 plasmo-bg-accent/75 plasmo-w-full plasmo-h-6 plasmo-rounded-b-lg plasmo-line-clamp-1">
        <p className='plasmo-text-secondary
        plasmo-line-clamp-1
        plasmo-text-xs'>{element.contractAddress}</p>
      </div>
    </div>


</>
  )
}

export default LoadedNFTElement