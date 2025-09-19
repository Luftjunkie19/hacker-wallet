import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';

type Props = {}

function NativeTokenAmount({}: Props) {

    const [amount, setAmount]=useState<number>(0);
        const publicAddress=useAppSelector((state)=>state.loggedIn.address);
        const currentNetworkRPCUrl =useAppSelector((state)=>state.currentNetworkConnected.rpcURL);
        const currentNetworkNativeTokenSymbol=useAppSelector((state)=> state.currentNetworkConnected.currencySymbol);

           const fetchAmountETH= useCallback(async ()=>{
            try {

              const provider = new ethers.JsonRpcProvider(currentNetworkRPCUrl);
              const balance = await provider.getBalance(publicAddress);

              console.log(balance);

              setAmount(Number(ethers.formatEther(balance)));
              
            } catch (error) {
              setAmount(0);
            }
            },[]);
        
            useEffect(()=>{
              fetchAmountETH();
            },[])
        
    



  return (
    <div className='plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-text-white'>
        {publicAddress && amount && <p className='plasmo-font-bold plasmo-text-2xl'>{Number(amount).toFixed(2)}</p>}
        <p className='plasmo-text-secondary plasmo-font-bold plasmo-text-2xl'>{currentNetworkNativeTokenSymbol}</p>
    </div>
  )
}

export default NativeTokenAmount