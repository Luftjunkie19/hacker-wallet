import React, { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { PiFlyingSaucerFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { SiOpensea } from "react-icons/si";
type Props = {}

function NFTsByWallet({}: Props) {
  const [nftElements, setElements]=useState<any[]>([]);
    const publicAddress=useAppSelector((state)=>state.loggedIn.address);

    const fetchNFTELements= useCallback(async ()=>{

      if(!publicAddress){
        return;
      }

        const url = `https://api.g.alchemy.com/data/v1/${process.env.PLASMO_ALCHEMY_API_KEY}/assets/nfts/by-address`;
        console.log(publicAddress);

const options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: `{"addresses":[{"address":"${publicAddress}","networks":["eth-sepolia"]}]}`
};
try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data.data.ownedNfts);
  setElements(data.data.ownedNfts);
} catch (error) {
  console.error(error);
  setElements([]);
}
    },[]);

    useEffect(()=>{
      fetchNFTELements();
    },[])

  return (
    <>
    {publicAddress && nftElements && nftElements.length > 0 &&
      <div className='plasmo-grid plasmo-grid-cols-3 plasmo-gap-4 '> 
      {nftElements.map((element, index)=>(<div>
        <p>NFT Element !</p>

      </div>))}
    </div>
      }

   {publicAddress && nftElements && nftElements.length === 0 && <div className='plasmo-w-full plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-3 plasmo-py-3'>
      <p className='plasmo-text-white plasmo-text-center'>No NFTs Owned Yet</p>
      <PiFlyingSaucerFill className='plasmo-text-secondary plasmo-text-6xl'/>
      <p className='plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-text-white'>Start Exploring NFT World on <Link to={'https://opensea.io/'} target='_blank'><SiOpensea className='plasmo-text-secondary plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-2xl'/></Link></p>
      </div>}



      </>
  )
}

export default NFTsByWallet