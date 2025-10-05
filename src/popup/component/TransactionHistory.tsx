import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react'
import { data } from 'react-router-dom';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';

type Props = {}

function TransactionHistory({}: Props) {

    const [transactions, setTransactions]=useState<any[]>([]);
    const currentChainId = useAppSelector((state)=>state.currentNetworkConnected.chainId);
        const publicAddress=useAppSelector((state)=>state.loggedIn.address);
        

        const fetchTransactions= useCallback(async ()=>{
              if(!publicAddress){
                return;
              }
const url = `https://api.etherscan.io/v2/api?chainid=${currentChainId}&module=account&action=txlist&address=${publicAddress}&startblock=0&endblock=latest&page=1&offset=100
&apikey=${process.env.PLASMO_PUBLIC_ETHERSCAN_API_KEY}`;

   const dataFetch= await fetch(url);

   const fullData= await dataFetch.json();
   
   console.log(fullData);

   setTransactions(fullData.result);

try {

} catch (error) {
  console.error(error);
}
            },[]);
        
            useEffect(()=>{
              fetchTransactions();
            },[]);
        


  return (
    <div className='plasmo-flex plasmo-flex-col plasmo-gap-3 plasmo-overflow-y-auto plasmo-h-72 plasmo-w-full'>
 
        {publicAddress && transactions && transactions.length > 0  && <>
        {transactions.map((tx, index)=>(<div
        key={index}
        id={`${index}`} className='plasmo-text-white plasmo-max-w-80 plasmo-w-full plasmo-flex plasmo-items-center 
        plasmo-rounded-lg
        plasmo-gap-3 plasmo-cursor-pointer plasmo-bg-accent plasmo-p-3'>
          <div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-2/3">
          {tx.functionName.trim().length > 0 && <p className='plasmo-text-secondary plasmo-text-sm plasmo-line-clamp-1'>{tx.functionName}</p>}
          <p className='plasmo-line-clamp-1 plasmo-text-xs'>{tx.hash}</p>

          </div>

          <p className='plasmo-text-red-500 plasmo-font-bold plasmo-text-sm'>-{(Number(tx.value) / 10 ** 18).toFixed(4)} ETH</p>
        </div>))}
        </>}
    </div>
  )
}

export default TransactionHistory