import React, { useCallback, useEffect, useState } from 'react'

import {  useAppSelector } from '~popup/state-managment/ReduxWrapper';

import { useNavigate } from 'react-router-dom';
import { deleteKey, fetchContainingKeywordElements, loadKey, saveKey} from '~popup/IndexedDB/WalletDataStorage';
import { ethers } from 'ethers';
import bcrypt  from 'bcryptjs';
import NetworksDropDown from './dropdowns/NetworksDropDown';
import SettingsDropDown from './dropdowns/SettingsDropDown';
import HeaderModal from './modals/HeaderModal';
import WalletModal from './WalletModal';
import { sendToBackground } from '@plasmohq/messaging';
import { set } from 'zod';




function Header() {
    const isLoggedIn= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const encryptedPrivateKey= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const encryptedPassword= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const currentNetwork = useAppSelector((selector)=>selector.currentNetworkConnected.chainId);
    const [openState, setOpenState]=useState<boolean>(false);
    const [existingRequestObj, setRequestingObj]=useState<any>();
    const [clickedButton, setClickedButton]=useState<'approve' | 'reject'>();
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

  

const loadExternalRequests=useCallback(async()=>{

  const sessionStorageRequest = await loadKey('external_request');

if(sessionStorageRequest){
setRequestingObj(sessionStorageRequest);
}


},[]);

useEffect(()=>{

  loadExternalRequests();

},[loadExternalRequests]);





    return (<>
{existingRequestObj
&& isLoggedIn &&
<div className='plasmo-bg-accent/80  plasmo-z-50 plasmo-absolute plasmo-flex plasmo-flex-col plasmo-gap-3
plasmo-top-0 plasmo-justify-between plasmo-left-0 plasmo-w-full plasmo-h-full plasmo-rounded-lg plasmo-p-2'>
<>
<p className='plasmo-text-secondary plasmo-p-2 plasmo-font-semibold plasmo-text-lg'>External Request</p>
<div className="plasmo-flex plasmo-flex-col plasmo-self-start plasmo-w-full plasmo-gap-3">
{existingRequestObj.method === 'eth_requestAccounts' && <>

<div className="plasmo-bg-primary plasmo-flex plasmo-justify-between plasmo-items-center plasmo-w-full plasmo-p-4 plasmo-rounded-lg">
<p className='plasmo-text-white'>Transaction Type</p>

<p className='plasmo-text-secondary plasmo-font-semibold'>{existingRequestObj.method}</p>
</div>

<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">

<p className='plasmo-text-white'>Message:</p>
<div className="plasmo-bg-primary plasmo-flex plasmo-flex-col plasmo-w-full plasmo-p-4 plasmo-rounded-lg">
  <p className='plasmo-text-white plasmo-text-sm plasmo-font-normal'>Welcome To HackerWallet ! 

    You got the external request from a Dapp. Because of security reasons, we want you to either approve or reject the 
    permission to the dapp.

    P.S. HACKERWALLET WILL NEVER ASK FOR YOUR MNEMONIC TO COMMIT A TRANSACTION !

  </p>
</div>

</div>

</>}

</div>


<div className="plasmo-flex plasmo-gap-3 plasmo-items-center plasmo-w-full">
<button onClick={async ()=>{
setClickedButton('reject');
await saveKey('request_reponse', {
    type:'response',
    method:'eth_requestAccounts',
    response:{
      addresses:null,
      chainId:null,
      error: 'You rejected the external request to connect the wallet.',
    }
  });

const res = await sendToBackground({
  name:'openExtension' as never,
  'body':{
    type:'response',
    response:{
      addresses:null,
      chainId:null,
      error:'You rejected the external request to connect the wallet.',
    }
  }
});

if(res){
  setClickedButton(undefined);
}

console.log(res, 'Response from background to popup');

}} className='plasmo-text-white hover:plasmo-bg-red-800 hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500 plasmo-bg-red-500 plasmo-p-2 plasmo-rounded-lg plasmo-w-44'>
  {clickedButton === 'reject' ? 'Rejecting...' : 'Reject'}
  </button>

<button onClick={async()=>{
setClickedButton('approve');
const elementsFetched = await fetchContainingKeywordElements();
const keystoredWallets = elementsFetched.filter((item)=>!item.loggedAt && item.address && item.encryptedWallet && item.password).map((item)=>item.address);

if(keystoredWallets.length > 0){

await saveKey('request_reponse', {
    type:'response',
    method:'eth_requestAccounts',
    response:{
      addresses:keystoredWallets,
      chainId:currentNetwork,
      error:null
    }
  });

const res =  await sendToBackground({
    name:'openExtension' as never,
    body:{
      type:'response',
      method:'eth_requestAccounts',
      response:{
        addresses:keystoredWallets,
        chainId:currentNetwork,
        error:null
      }
    }
  });
  console.log(res, 'Response from background');

  

}else{
   await saveKey('request_reponse', {
    type:'response',
    method:'eth_requestAccounts',
    response:{
      addresses:null,
      error: 'You have no key-wallets available.',
    }
  });

const res =  await sendToBackground({
  name: 'openExtension' as never,
  'body':{
      method:'eth_requestAccounts',
    type:'response',
    response:{
      error:'You have no key-wallets available.',
      addresses:null,
    }
  }
});

if(res){
  setClickedButton(undefined);
}

console.log(res, 'Response from background');
}
}} className='plasmo-text-secondary hover:plasmo-bg-secondary hover:plasmo-text-primary hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500 plasmo-bg-primary plasmo-p-2 plasmo-rounded-lg plasmo-w-44'>
{clickedButton === 'approve' ? 'Approving...' : 'Approve'}
  
  </button>
</div>
</>

</div>
}



<div className="plasmo-gap-12 plasmo-flex 
   plasmo-justify-between plasmo-w-full
    plasmo-items-center">
<div>
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