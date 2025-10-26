import React from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';

type Props = {element:any, index:number}

function ImportedNFT({element}: Props) {

  const blockExplorerURL=useAppSelector((selector)=>selector.currentNetworkConnected.blockExplorerURL);

  const chromeContractRedirection=()=>{
console.log(
  element
);

      chrome.tabs.create(
          {
              url:`${blockExplorerURL}/token/${element.nftAddress}`
          }
      )
  }


return (
<div
onClick={chromeContractRedirection}
id={`${
  crypto.randomUUID()
  }`} className='plasmo-w-24 plasmo-relative plasmo-top-0 plasmo-left-0 plasmo-h-24 plasmo-cursor-pointer plasmo-rounded-lg'>
      <img src={`${element.image}`} height={64} width={64} className='plasmo-w-full plasmo-rounded-lg plasmo-h-full'/>

      <div className="plasmo-absolute plasmo-p-1 plasmo-bottom-0 plasmo-left-0 plasmo-bg-accent/75 plasmo-w-full plasmo-h-6 plasmo-rounded-b-lg plasmo-line-clamp-1">
        <p className='plasmo-text-secondary plasmo-text-xs'>{element.tokenName}</p>
      </div>
    </div>
  )
}

export default ImportedNFT