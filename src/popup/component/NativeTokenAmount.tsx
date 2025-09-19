import React, { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';

type Props = {}

function NativeTokenAmount({}: Props) {

    const [amount, setAmount]=useState<number>(0);
        const publicAddress=useAppSelector((state)=>state.loggedIn.address);
           const fetchAmountETH= useCallback(async ()=>{
        
              if(!publicAddress){
                return;
              }
        
                
                const url = `https://adi-testnet.g.alchemy.com/v2/${
                process.env.PLASMO_PUBLIC_ALCHEMY_API_KEY
                }`;
const options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: `{"0":"${publicAddress}","1":"latest"}`
};
try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
  const numberAmount= Number(data.result);

  setAmount(numberAmount);

} catch (error) {
  console.error(error);
}
            },[]);
        
            useEffect(()=>{
              fetchAmountETH();
            },[])
        
    



  return (
    <div className='plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-text-white'>
        {publicAddress && amount && <p className='plasmo-font-bold plasmo-text-2xl'>{Number(amount).toFixed(2)}</p>}
        <p className='plasmo-text-secondary plasmo-font-bold plasmo-text-2xl'>ETH</p>
    </div>
  )
}

export default NativeTokenAmount