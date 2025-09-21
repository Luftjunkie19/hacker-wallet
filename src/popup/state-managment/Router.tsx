import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './ReduxWrapper';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CreateNewWallet from '~popup/NoWalletScreens/CreateNewWallet';
import Home from '~popup/LogggedInScreens/Home';
import RestoreWallet from '../NoWalletScreens/RestoreWallet';
import UnloggedScreen from '~popup/UnloggedScreen';
import { loadKey } from '~popup/IndexedDB/WalletDataStorage';
import { setCurrentWallet } from './slices/LoggedInWallet';
import TransferScreen from '~popup/LogggedInScreens/TransferScreen';

type Props = {}

function Router({}: Props) {
  const selector = useAppSelector((state)=>state.loggedIn.encryptedWallet);

  const dispatch =useAppDispatch();

  const loadElement=useCallback(async ()=>{
    const loadedDb= await loadKey(`session`);
    console.log(loadedDb);

    if(typeof loadedDb !== 'undefined') dispatch(setCurrentWallet({'address':loadedDb.account, 'encryptedWallet':loadedDb.encryptedWallet,
      password: loadedDb.password,
    }));
    
  },[]);


  useEffect(()=>{
    loadElement();
  },[]);


  return (
<>
<MemoryRouter>
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