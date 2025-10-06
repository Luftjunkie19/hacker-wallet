import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './ReduxWrapper';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import CreateNewWallet from '~popup/NoWalletScreens/CreateNewWallet';
import Home from '~popup/LogggedInScreens/Home';
import RestoreWallet from '../NoWalletScreens/RestoreWallet';
import UnloggedScreen from '~popup/UnloggedScreen';
import { loadKey } from '~popup/IndexedDB/WalletDataStorage';
import { setCurrentWallet } from './slices/LoggedInWallet';
import TransferScreen from '~popup/LogggedInScreens/TransferScreen';
import Header from '~popup/component/Header';
import { setCurrentNetwork } from './slices/CurrentWalletNetwork';

type Props = {}

function Router({}: Props) {
  const selector = useAppSelector((state)=>state.loggedIn.encryptedWallet);
  const currentSessionAddress= useAppSelector((state)=>state.loggedIn.address);
  const dispatch =useAppDispatch();

  const loadElement=useCallback(async ()=>{
    const loadedDb= await loadKey(`session`);

    const loadedCurrentNetwork = await loadKey('currentConnectedNetwork');


    if(typeof loadedDb !== 'undefined') dispatch(setCurrentWallet({'address':loadedDb.account, 'encryptedWallet':loadedDb.encryptedWallet,
      password: loadedDb.password,
    }));

    if(typeof loadedCurrentNetwork !== 'undefined') dispatch(setCurrentNetwork({...loadedCurrentNetwork}));

    
  },[selector]);


 

  useEffect(()=>{

    loadElement();
  },[loadElement]);


useEffect(()=>{
  
window.addEventListener('message', (ev)=>{
  if(ev.data.target === 'extension-popup'){
    console.log('Hello');
  }
});

return ()=> window.removeEventListener('message', (ev)=>{
  if(ev.data.target === 'extension-popup'){
    console.log('Hello');
  }
})



},[])


  return (
<>

<MemoryRouter>
<Header/>
  <Routes>
  {
   !selector ?
   <>
   <Route  path="/" element={<UnloggedScreen />} />
   <Route path="/restore" element={<RestoreWallet />} />
   <Route path="/create-new" element={<CreateNewWallet />} />
   </> : <>
<Route path='/' element={<Home/>}/>
<Route path='/transfer' element={<TransferScreen/>}/>
   </>
  }

    </Routes>
</MemoryRouter>

</>
  )
}

export default Router