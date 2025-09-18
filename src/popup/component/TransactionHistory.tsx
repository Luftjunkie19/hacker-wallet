import React, { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';

type Props = {}

function TransactionHistory({}: Props) {

    const [transactions, setElements]=useState<any[]>([]);
        const publicAddress=useAppSelector((state)=>state.loggedIn.address);

        const fetchTransactions= useCallback(async ()=>{
              if(!publicAddress){
                return;
              }
        
          const url = `https://api.g.alchemy.com/data/v1/${process.env.PLASMO_ALCHEMY_API_KEY}/transactions/history/by-address`;
const options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: `{"addresses":[{"address":"${publicAddress}","networks":["eth-mainnet"]}]}`
};
try {
  const response = await fetch(url, options);
  const data = await response.json();
  setElements(data.transactions);
} catch (error) {
  console.error(error);
}
            },[]);
        
            useEffect(()=>{
              fetchTransactions();
            },[])
        


  return (
    <div>
        {publicAddress && transactions && transactions.length > 0 && <>
        {transactions.map((item)=>(<p onClick={()=>console.log(item)}>Click TX</p>))}
        </>}
    </div>
  )
}

export default TransactionHistory