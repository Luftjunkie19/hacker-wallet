import React, { useCallback, useEffect, useState } from 'react'

import {  useAppSelector } from '~popup/state-managment/ReduxWrapper';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { deleteKey, loadKey } from '~popup/IndexedDB/WalletDataStorage';
import {useMessage, usePort} from '@plasmohq/messaging/hook';
import { ethers } from 'ethers';
import bcrypt  from 'bcryptjs';
import NetworksDropDown from './dropdowns/NetworksDropDown';
import SettingsDropDown from './dropdowns/SettingsDropDown';
import HeaderModal from './modals/HeaderModal';
import WalletModal from './WalletModal';
import { sendToBackground } from '@plasmohq/messaging';
import { getPort } from '@plasmohq/messaging/port';



function Header() {
    const isLoggedIn= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const encryptedPrivateKey= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const encryptedPassword= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const [openState, setOpenState]=useState<boolean>(false);
    const [existingRequestObj, setRequestingObj]=useState<any>();
    const [openExternalModalInteraction, setOpenInternalModalInteraction]=useState<boolean>(false);
    const [password, setPassword]=useState<string>();
    const [accountDetails, setAccountDetails]=useState<{mnemonic:string, privateKey:string}>();
const navigate=useNavigate();
    const logoutFromWallet= async ()=>{
await deleteKey('session');
await deleteKey('currentConnectedNetwork');

navigate('/');
    }

    const handleGetAccountDetails= async ()=>{

const isPasswordNotTheSame = await bcrypt.compare(password, encryptedPassword)
  if(isPasswordNotTheSame){
  alert('Password are not the same');
  return;
  }

      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedPrivateKey, password);


      if(wallet){
        setAccountDetails({mnemonic:((wallet as any).mnemonic).phrase, privateKey:wallet.privateKey })
      setPassword(null);
      }
    }
const conveyerPort= usePort('portHandler');
const urlParams = new URLSearchParams(window.location.search);
const requestId = urlParams.get('requestId');


useEffect(()=>{

  console.log('Log on every render');

});


    return (<>
{requestId && <div className='plasmo-bg-accent/80 plasmo-absolute plasmo-flex plasmo-flex-col plasmo-gap-3
plasmo-top-0 plasmo-items-center plasmo-justify-between plasmo-left-0 plasmo-w-full plasmo-h-full plasmo-rounded-lg plasmo-p-2'>
<>
<div className="plasmo-flex plasmo-flex-col plasmo"></div>
<p className=' plasmo-text-white'>{JSON.stringify(requestId)}</p>

<button onClick={()=>{
  console.log(chrome);
}} className='plasmo-text-secondary hover:plasmo-bg-secondary hover:plasmo-text-primary hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500 plasmo-bg-primary plasmo-p-2 plasmo-rounded-lg plasmo-w-64'>Approve</button>
</>

</div>
}
<div className="plasmo-gap-12 plasmo-flex 
   plasmo-justify-between plasmo-w-full
    plasmo-items-center">
<div onClick={async ()=>{
  
console.log('hello from popup');
const message = await sendToBackground({
  'body':{
    message:'Hello from popup.'
  },'name':'conveyer', 
  'sender':{'origin':"extension-popup"
  }});

  conveyerPort.send({
    responseBack:'Hello from Popup'
  });

  console.log(message, 'message from popup');

}}>
<img src={require('../icon.png')} width={56}height={56}className="plasmo-w-12 plasmo-cursor-pointer plasmo-h-12 plasmo-rounded-lg" alt="HackerWallet Logo" />    
      </div>

{
  isLoggedIn &&
<WalletModal/>
}


      {
isLoggedIn &&
      <div className="plasmo-flex plasmo-outline-none plasmo-gap-4">
<NetworksDropDown/>
<SettingsDropDown openSensitiveModal={()=>setOpenState(true)} logoutFromWallet={logoutFromWallet}/>
      </div>
      }

      {openState && 
      <HeaderModal closeModalEntirely={() => {
          setOpenState(false);
          setAccountDetails(null);
          setPassword(null);
        }}
        setPassword={setPassword}
      password={password}
      handleGetAccountDetails={handleGetAccountDetails}
      accountDetails={accountDetails}
      />
      
      }
      </div>
    </>
  )
}

export default Header