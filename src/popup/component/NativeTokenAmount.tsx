
import React from 'react'
import useFetchNativeAmount from '~popup/hooks/useFetchNativeAmount';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';



function NativeTokenAmount() {
        const publicAddress=useAppSelector((state)=>state.loggedIn.address);
        const currentNetworkNativeTokenSymbol=useAppSelector((state)=> state.currentNetworkConnected.currencySymbol);
        const {amount}=useFetchNativeAmount();
  
    



  return (
    <div className='plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-text-white'>

{
publicAddress
&& !isNaN(Number(amount))
&& Number(amount) === 0 &&
<p
className='plasmo-font-bold plasmo-text-2xl'
>
0.0000
</p>

}

        {publicAddress
        && !isNaN(Number(amount))
        && Number(amount) > 0 &&
        <p className='plasmo-font-bold plasmo-text-2xl'>{
   Number(amount)=== 0 ? "0.0000" :
          Number(amount).toFixed(5)}</p>}
        <p className='plasmo-text-secondary plasmo-font-bold plasmo-text-2xl'>{currentNetworkNativeTokenSymbol}</p>
    </div>
  )
}

export default NativeTokenAmount