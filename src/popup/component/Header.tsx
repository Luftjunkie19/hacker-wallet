import { DropdownMenu } from 'radix-ui';
import React, { useState } from 'react'
import { IoGitNetworkSharp, IoLogOut } from "react-icons/io5";
import {FaClipboard, FaEthereum, FaExternalLinkAlt} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { IoMdAddCircle } from 'react-icons/io';
import { redirect } from 'react-router-dom';
import { deleteKey, fetchContainingKeywordElements } from '~popup/IndexedDB/WalletDataStorage';
import { setCurrentNetwork } from '~popup/state-managment/slices/CurrentWalletNetwork';
import TransferModal from './modals/TransferModal';
import { ethers } from 'ethers';
import bcrypt  from 'bcryptjs';
import NetworksDropDown from './dropdowns/NetworksDropDown';
import SettingsDropDown from './dropdowns/SettingsDropDown';
import HeaderModal from './modals/HeaderModal';
type Props = {}

function Header({}: Props) {
    const isLoggedIn= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const encryptedPrivateKey= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const encryptedPassword= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const [openState, setOpenState]=useState<boolean>(false);
    const [password, setPassword]=useState<string>();
    const [accountDetails, setAccountDetails]=useState<{mnemonic:string, privateKey:string}>();

    const logoutFromWallet= async ()=>{
await deleteKey('session');
    }


    const handleGetAccountDetails= async ()=>{
console.log(password);

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
    <div className="plasmo-gap-24 plasmo-flex 
   plasmo-justify-between plasmo-w-full
    plasmo-items-center">
           <div
           onClick={()=>{
            redirect('/');
           window.location.reload();
           }}
           className="self-center
           plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-cursor-pointer
           ">
              <img src={require('../icon.png')} width={56}height={56}className="plasmo-w-12 plasmo-h-12 plasmo-rounded-lg" alt="HackerWallet Logo" />
        <p className="plasmo-text-lg plasmo-text-center plasmo-font-bold plasmo-text-secondary">
        HackerWallet
      </p>
      </div>

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