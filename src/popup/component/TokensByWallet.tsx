import React, { useCallback, useEffect, useState } from 'react'
import { FaClipboard } from 'react-icons/fa';
import { PiFlyingSaucerFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';

type Props = {}

function TokensByWallet({}: Props) {
  const [tokens, setElements]=useState<any[]>([]);
    const publicAddress=useAppSelector((state)=>state.loggedIn.address);
       const fetchTokensCoins= useCallback(async ()=>{
    
          if(!publicAddress){
            return;
          }
    
            const url = `https://api.g.alchemy.com/data/v1/${process.env.PLASMO_ALCHEMY_API_KEY}/assets/tokens/by-address`;
            console.log(publicAddress);
    
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: `{"addresses":[{"address":"${publicAddress}","networks":["eth-sepolia"]}]}`
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data.data.tokens);
      setElements(data.data.tokens);
    } catch (error) {
      console.error(error);
      setElements([]);
    }
        },[]);
    
        useEffect(()=>{
          fetchTokensCoins();
        },[])
    



  return (
    <>
 {publicAddress && tokens && tokens.length > 0 &&
      <div className='plasmo-flex plasmo-flex-col plasmo-w-full plasmo-gap-4 plasmo-overflow-y-auto'> 
      {tokens.map((element, index)=>(<div className='plasmo-w-full plasmo-bg-accent plasmo-p-2 plasmo-rounded-lg plasmo-flex plasmo-items-center plasmo-justify-between'>
        <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
    <p className='plasmo-text-white plasmo-line-clamp-1'>{element.tokenMetadata.name ?? "Ether"}  ({element.tokenMetadata.symbol ?? "ETH"})</p>
    <button onClick={()=>navigator.clipboard.writeText(element.tokenAddress)} className='plasmo-text-sm plasmo-w-fit plasmo-p-1 plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-secondary'>
    <FaClipboard />
        Copy address
        </button>
        </div>

<div>
    <p className='plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-white plasmo-font-semibold'>{((Number(element.tokenBalance)) /  (10 ** (element.tokenMetadata.decimals ?? 18))).toFixed(2)} <span className='plasmo-text-secondary'>{element.tokenMetadata.symbol ?? "ETH"}</span></p>
</div>

     </div>))}
    </div>
      }


        {tokens && tokens.length === 0 && publicAddress && <>           
      <p className='plasmo-text-white plasmo-text-center'>No Coins nor Tokens Owned Yet</p>
      <PiFlyingSaucerFill className='plasmo-text-secondary plasmo-text-6xl'/>
      <p className='plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-text-white'>Start Exploring Coins and Tokens on 
        <Link className='plasmo-pink-500' to={'https://app.uniswap.org/'} target='_blank'>Uniswap</Link>
        </p>
        </>}


    </>
  )
}

export default TokensByWallet