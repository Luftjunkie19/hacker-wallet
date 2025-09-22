import React from 'react'
import { PiFlyingSaucerFill } from 'react-icons/pi'
import { SiOpensea } from 'react-icons/si'
import { Link } from 'react-router-dom'

type Props = {}

function NoNFTs({}: Props) {
  return (
  <div className='plasmo-w-full plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-3 plasmo-py-3'>
        <p className='plasmo-text-white plasmo-text-center'>No NFTs Owned Yet</p>
        <PiFlyingSaucerFill className='plasmo-text-secondary plasmo-text-6xl'/>
        <p className='plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-text-white'>Start Exploring NFT World on <Link to={'https://opensea.io/'} target='_blank'><SiOpensea className='plasmo-text-secondary plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-2xl'/></Link></p>
        </div>
  )
}

export default NoNFTs