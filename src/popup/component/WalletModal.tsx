import React, { useCallback, useEffect, useState } from 'react'
import { fetchContainingKeywordElements } from '~popup/IndexedDB/WalletDataStorage';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
import TransferModal from './modals/TransferModal';
import { CiImport } from "react-icons/ci";
import LoggedInImportWalletForm from './forms/LoggedInImportWalletForm';

type Props = {}

function WalletModal({}: Props) {
const [wallets, setWallets]=useState<any[]>([]);
const currentSessionAddress = useAppSelector((state)=>state.loggedIn.address);
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


  <div onClick={()=>setOpenModal(true)} className={`plasmo-flex plasmo-cursor-pointer plasmo-items-center plasmo-gap-3 plasmo-bg-accent plasmo-rounded-lg plasmo-max-w-36 plasmo-p-2 plasmo-w-full`}>
  <p className='plasmo-text-secondary plasmo-font-semibold plasmo-text-xs plasmo-line-clamp-1'>{currentSessionAddress}</p>
  </div>


{modalOpen && 
  <TransferModal setCloseModal={()=>setOpenModal(false)}>

    <div className="plasmo-w-full plasmo-h-full plasmo-flex plasmo-flex-col plasmo-justify-between plasmo-items-center plasmo-gap-3">
  <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-gap-2">
  {wallets && !displayForm &&
  wallets.map((item, index)=>(<div
  className='plasmo-p-2 plasmo-cursor-pointer plasmo-bg-accent plasmo-max-w-80 plasmo-w-full plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-rounded-lg plasmo-border-secondary plasmo-border-2'
  id={`${index}`}>
  <div className='plasmo-bg-secondary plasmo-backdrop-blur-lg plasmo-rounded-full plasmo-w-8 plasmo-h-8'/> 
  <p className='plasmo-text-white plasmo-text-wrap plasmo-line-clamp-1 plasmo-text-xs'>
  {item.address}
    </p>
  </div>))}

  </div>


{displayForm && <LoggedInImportWalletForm/>}

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