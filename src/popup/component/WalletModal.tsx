import React, { useCallback, useEffect, useState } from 'react'
import { fetchContainingKeywordElements, loadKey, saveKey } from '~popup/IndexedDB/WalletDataStorage';
import { useAppDispatch, useAppSelector } from '~popup/state-managment/ReduxWrapper';
import TransferModal from './modals/TransferModal';
import { CiImport } from "react-icons/ci";
import LoggedInImportWalletForm from './forms/LoggedInImportWalletForm';
import { BiCircle } from 'react-icons/bi';
import { set } from 'zod';
import { setCurrentWallet } from '~popup/state-managment/slices/LoggedInWallet';

type Props = {}

function WalletModal({}: Props) {
const [wallets, setWallets]=useState<any[]>([]);
const currentSessionAddress = useAppSelector((state)=>state.loggedIn.address);
const dispatch = useAppDispatch();
const [modalOpen, setOpenModal]=useState<boolean>(false);
const [
  displayForm, setDisplayForm
]=useState<boolean>(false);

    const handleGetWallets=useCallback(
        async()=>{
      const loadedElements= await fetchContainingKeywordElements();
      
      const wallets = loadedElements.filter((item)=>item.encryptedWallet && item.password && !item.loggedAt);
      
      setWallets(wallets);
      
        },[wallets]);
      

        useEffect(()=>{
            handleGetWallets();
        },[handleGetWallets]);


  return (<>
  <div onClick={()=>setOpenModal(true)} className={`plasmo-flex plasmo-cursor-pointer plasmo-items-center plasmo-gap-3 plasmo-bg-accent plasmo-rounded-lg plasmo-max-w-36 plasmo-py-1 plasmo-px-3 plasmo-w-full`}>
<BiCircle size={32} className='plasmo-text-secondary'/>
  <p className='plasmo-text-secondary plasmo-font-semibold plasmo-text-xs plasmo-line-clamp-1'>{currentSessionAddress}</p>
  </div>


{modalOpen && 
  <TransferModal setCloseModal={()=>{
    setOpenModal(false);
}}>

    <div className="plasmo-w-full plasmo-h-full plasmo-flex plasmo-flex-col plasmo-justify-between plasmo-items-center plasmo-gap-3">
 <div className="plasmo-flex plasmo-flex-col plasmo-w-full plasmo-gap-2">
 <p className='plasmo-text-white plasmo-font-semibold plasmo-text-lg'>Imported Wallets</p>
  <div className="plasmo-flex plasmo-h-full plasmo-overflow-y-auto plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-gap-4">
  {wallets && !displayForm &&
  wallets.map((item, index)=>(<div
  key={index}
  onClick={async ()=>{

    console.log({item});
    const alreadyLoggedInWallet = await loadKey('session');

    await saveKey('session', {...alreadyLoggedInWallet, account:item.address, encryptedWallet: item.encryptedWallet, 
      password:item.password,
      loggedAt: Date.now(),
      expiresAt: Date.now() + 2 * 1000 * 60 * 60,

     });
    dispatch(setCurrentWallet({'address':item.address, 'encryptedWallet':item.encryptedWallet, 'password':item.password}));
    setOpenModal(false);
  }}
  className={`plasmo-p-2 plasmo-cursor-pointer 
    ${currentSessionAddress === item.address ? 'plasmo-border-secondary plasmo-border-2' : 'plasmo-border plasmo-border-primary hover:plasmo-border-secondary hover:plasmo-scale-95'}
    plasmo-bg-accent plasmo-max-w-80 plasmo-w-full 
    plasmo-flex plasmo-gap-2 
    plasmo-items-center plasmo-rounded-lg 
    plasmo-transition-all plasmo-duration-500
  `}
  id={`${index}`}>
  <div className='plasmo-bg-secondary plasmo-backdrop-blur-lg plasmo-rounded-full plasmo-w-8 plasmo-h-8'/> 
  <p className='plasmo-text-white plasmo-text-wrap plasmo-line-clamp-1 plasmo-text-xs'>
  {item.address}
    </p>
  </div>))}

  </div>
 </div>


{displayForm && <LoggedInImportWalletForm onClose={()=>{
  setDisplayForm(false)}}/>}

{
!displayForm &&
<button
onClick={()=>{
  setDisplayForm(true);
}}
className='plasmo-bg-primary plasmo-mb-3 plasmo-group hover:plasmo-scale-95 plasmo-group-hover:plasmo-bg-secondary plasmo-transition-all plasmo-duration-500 plasmo-p-3 plasmo-flex plasmo-items-center plasmo-gap-4 plasmo-rounded-lg plasmo-text-white'>
<CiImport className='plasmo-text-xl plasmo-group-hover:plasmo-text-primary plasmo-text-secondary'/>

<span className='plasmo-text-xs plasmo-group-hover:plasmo-text-accent plasmo-font-semibold'>
Import Wallet by Recovery Phrase/Private Key
</span>
</button>  
}

</div>

  
  
    </TransferModal>
}

  
  </>
  )
}

export default WalletModal