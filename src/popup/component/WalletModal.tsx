import React, { useCallback, useEffect, useState } from 'react'
import { fetchContainingKeywordElements } from '~popup/IndexedDB/WalletDataStorage';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
import Modal from './modals/Modal';

type Props = {}

function WalletModal({}: Props) {
const [wallets, setWallets]=useState<any[]>();
const currentSessionAddress = useAppSelector((state)=>state.loggedIn.address);
const [modalOpen, setOpenModal]=useState<boolean>(false);

    const handleGetWallets=useCallback(
        async()=>{
      const loadedElements= await fetchContainingKeywordElements();
      
      const wallets = loadedElements.filter((item)=>item.encryptedWallet && item.password && !item.loggedAt);
      
      setWallets(wallets);
      
        },[]);
      

        useEffect(()=>{
            handleGetWallets();
        },[]);


  return (<>
  <div onClick={()=>setOpenModal(true)} className={`plasmo-flex plasmo-items-center plasmo-gap-3 plasmo-max-w-20 plasmo-w-full`}>
  <p className='plasmo-text-secondary plasmo-font-semibold plasmo-text-sm plasmo-line-clamp-1'>{currentSessionAddress}</p>
  </div>

  {modalOpen && <Modal title='Choose a wallet to connect to'>
    <p>Hello</p>
    </Modal>}
  
  </>
  )
}

export default WalletModal