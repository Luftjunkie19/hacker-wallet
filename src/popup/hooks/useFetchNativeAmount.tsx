import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';



function useFetchNativeAmount() {
    const [amount, setAmount]=useState<number>(0);
    const publicAddress=useAppSelector((state)=>state.loggedIn.address);
    const currentNetworkRPCUrl =useAppSelector((state)=>state.currentNetworkConnected.rpcURL);
    const fetchAmountETH= useCallback(async ()=>{
     try {

        if(!publicAddress || !currentNetworkRPCUrl){
            throw new Error('No essential data given');
        }

       const provider = new ethers.JsonRpcProvider(currentNetworkRPCUrl);
       const balance = await provider.getBalance(publicAddress);

       console.log(balance);

       setAmount(Number(ethers.formatEther(balance)));
       
     } catch (error) {
       setAmount(0);
     }
     },[currentNetworkRPCUrl, publicAddress]);
 
     useEffect(()=>{
       fetchAmountETH();
     },[fetchAmountETH])
 

     return {
        amount
     }

}

export default useFetchNativeAmount