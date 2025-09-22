import React from 'react'

type Props = {element:any, index:number}

function ImportedNFT({element, index}: Props) {
  return (
<div id={`${index}`} className='plasmo-w-28 plasmo-relative plasmo-top-0 plasmo-left-0 plasmo-h-28 plasmo-rounded-lg'>
      <img src={`${element.image}`} height={64} width={64} className='plasmo-w-full plasmo-rounded-lg plasmo-h-full'/>

      <div className="plasmo-absolute plasmo-p-1 plasmo-bottom-0 plasmo-left-0 plasmo-bg-accent/75 plasmo-w-full plasmo-h-6 plasmo-rounded-b-lg plasmo-line-clamp-1">
        <p className='plasmo-text-secondary plasmo-text-xs'>{element.tokenName}</p>
      </div>
    </div>
  )
}

export default ImportedNFT