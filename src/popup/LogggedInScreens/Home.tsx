import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Actions from '~popup/component/Actions'
import NativeTokenAmount from '~popup/component/NativeTokenAmount'
import WalletTabs from '~popup/component/WalletTabs'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper'

type Props = {}

function Home({}: Props) {
const currentSessionAddress=useAppSelector((state)=>state.loggedIn.address);
const navigate = useNavigate();


const onReceived=(message, sender) => {
    if (message.target === "hackerWallet" && currentSessionAddress) {
      navigate('/transfer');
    }
  };


  useEffect(()=>{
chrome.runtime.onMessage.addListener(onReceived);

  return ()=> chrome.runtime.onMessage.removeListener(onReceived);
  },[])

  return (
    <div
    className=' plasmo-h-full plasmo-w-full plasmo-overflow-y-hidden plasmo-bg-primary plasmo-p-3
    '>

<NativeTokenAmount/>

<Actions/>

<WalletTabs/>

    </div>
  )
}

export default Home