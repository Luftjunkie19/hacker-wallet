import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './ReduxWrapper';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CreateNewWallet from '~popup/CreateNewWallet';
import Home from '~popup/LogggedInScreens/Home';
import RestoreWallet from '~popup/RestoreWallet';
import UnloggedScreen from '~popup/UnloggedScreen';
import { loadKey } from '~popup/IndexedDB/walletStorage';
import { setCurrentWallet } from './slices/LoggedInWallet';

type Props = {}

function Router({}: Props) {
  const selector = useAppSelector((state)=>state.loggedIn.encryptedWallet);

  const dispatch =useAppDispatch();

  const loadElement=useCallback(async ()=>{
    const loadedDb= await loadKey(`session`);
    console.log(loadedDb);

    if(typeof loadedDb !== 'undefined') dispatch(setCurrentWallet({'address':loadedDb.account, 'encryptedWallet':loadedDb.encryptedWallet}));
    
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
<Route path="/restore" element={<Home/>}/>
<Route path="create-new" element={<Home/>}/>
   </>
  }

    </Routes>
</MemoryRouter>

</>
  )
}

export default Router