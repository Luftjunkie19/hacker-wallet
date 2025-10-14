import React, { useCallback, useEffect, useState } from 'react'

import {  useAppSelector } from '~popup/state-managment/ReduxWrapper';

import { useNavigate } from 'react-router-dom';
import { deleteKey, fetchContainingKeywordElements } from '~popup/IndexedDB/WalletDataStorage';

import { ethers } from 'ethers';
import bcrypt  from 'bcryptjs';
import NetworksDropDown from './dropdowns/NetworksDropDown';
import SettingsDropDown from './dropdowns/SettingsDropDown';
import HeaderModal from './modals/HeaderModal';
import WalletModal from './WalletModal';

function Header() {
    const isLoggedIn= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const encryptedPrivateKey= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const encryptedPassword= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const [openState, setOpenState]=useState<boolean>(false);
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





    return (
    <div className="plasmo-gap-12 plasmo-flex 
   plasmo-justify-between plasmo-w-full
    plasmo-items-center">
<div onClick={async()=>{

chrome.runtime.sendMessage({type:"response", from:'hackerWallet-popup', payload:{
  message:'HELLO'
}},()=>{
  console.log('Message got sent');
}
);

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
  )
}

export default Header