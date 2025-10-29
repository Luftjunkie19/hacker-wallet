import '~style.css';
import { Link, useNavigate } from "react-router-dom"
import { fetchContainingKeywordElements } from './IndexedDB/WalletDataStorage';
import { useAppDispatch, useAppSelector } from './state-managment/ReduxWrapper';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import bcrypt from 'bcryptjs';
import { setCurrentWallet } from './state-managment/slices/LoggedInWallet';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

function UnloggedScreen() {

  const currentSessionAddress = useAppSelector((state)=>state.loggedIn.address);
  const dispatch =useAppDispatch();
  const navigation = useNavigate();

  const {data:keystoredWallets, error }=useQuery({
    queryKey:['storedWallets'],
    queryFn:async ()=>{
      try {
        console.log('Function called');

        const elementsFetched = await fetchContainingKeywordElements();
        
        return elementsFetched.filter((item)=>!item.loggedAt && item.address && item.encryptedWallet && item.password);
      } catch (error) {
        console.error(error);
      }
    }
  });


  const zodSchema = z.object({
    password: z.string().min(12, {'message':'Password must be at least 12 characters long'})
  }).required({'password':true});

  const {register, handleSubmit, watch, setError}=useForm<z.infer<typeof zodSchema>>({
    'defaultValues':{
      'password':''
    },
    mode:'onBlur',
    resolver: zodResolver(zodSchema)
  });

  const handleAuth= async ()=>{
    try {

      if(!keystoredWallets || keystoredWallets.length === 0){
        setError('password', {'message':'No wallets found. Please create or restore a wallet.'});
        return
      }


      const validExistingWallet = keystoredWallets.find((wallet)=>bcrypt.compareSync(watch('password'), wallet.password));

console.log({validExistingWallet});

      if(validExistingWallet){
alert('Wallet Unlocked Successfully');

        dispatch(setCurrentWallet({
          'address':validExistingWallet.address,
          'encryptedWallet':validExistingWallet.encryptedWallet,
          'password': watch('password')
        }));

        navigation('/');

        return
      }

      setError('password', {'message':'No wallet found with the provided password'});

      
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('password', {'message':'An error occurred during authentication. Please try again.'});
    }
  }

  return (      
      <div className="plasmo-flex plasmo-self-end plasmo-justify-center plasmo-h-full plasmo-flex-col plasmo-w-full plasmo-gap-3 plasmo-items-center">

{!error && <>
{!currentSessionAddress && keystoredWallets && keystoredWallets.length > 0 ?
<form onSubmit={handleSubmit(handleAuth, (err)=>{
  console.log('Form submission errors:', err);
})} className="plasmo-flex plasmo-flex-col plasmo-w-full plasmo-gap-3 plasmo-justify-between plasmo-h-full" >
<div className="plasmo-flex plasmo-flex-col plasmo-gap-4 plasmo-items-center plasmo-w-full plasmo-justify-center">
  <p className='plasmo-text-white plasmo-font-bold plasmo-text-xl'>Welcome Back To Hacker Wallet</p>
  <img src={require('./icon.png')} width={64} height={64} className='plasmo-w-32 plasmo-h-32 plasmo-border plasmo-rounded-lg plasmo-border-secondary'/>
</div>

<div className="plasmo-flex plasmo-flex-col plasmo-w-full plasmo-gap-2">
  <p className='plasmo-text-white plasmo-font-semibold'>Password</p>

  <input {...register('password')} type="password" className='plasmo-bg-accent plasmo-w-full plasmo-rounded-lg plasmo-px-3 plasmo-py-2 plasmo-text-white plasmo-border plasmo-border-secondary
  plasmo-focus:plasmo-outline-none plasmo-focus:plasmo-border-white plasmo-transition-all plasmo-duration-500
  plasmo-placeholder:plasmo-text-sm
  placeholder:plasmo-text-white
  '/>
</div>

<button type="submit" className="plasmo-bg-secondary plasmo-text-center flex plasmo-items-center plasmo-justify-center plasmo-border plasmo-w-full plasmo-border-accent
        plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-2 plasmo-text-primary hover:plasmo-border-secondary hover:plasmo-text-white
         hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500">
          Unlock
        </button>

</form> : <>
        <Link to={'/create-new'} className="plasmo-bg-secondary plasmo-text-center flex plasmo-items-center plasmo-justify-center plasmo-border plasmo-w-full plasmo-border-accent
        plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-2 plasmo-text-primary hover:plasmo-border-secondary hover:plasmo-text-white
         hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500">
          Create New Wallet
        </Link>



          <Link to={'/restore'} className="plasmo-bg-secondary flex plasmo-items-center plasmo-text-center plasmo-justify-center plasmo-border plasmo-w-full plasmo-border-accent
        plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-2 plasmo-text-primary
         hover:plasmo-border-secondary hover:plasmo-text-white
         hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500">
          Restore Wallet
        </Link>
</>
}
</>}


{error && <div className='plasmo-flex plasmo-flex-col plasmo-justify-center plasmo-items-center plasmo-gap-2'>
  <p className='plasmo-text-red-500 plasmo-text-xl plasmo-font-bold'>Error Occured</p>
  
  <p className='plasmo-text-white'>Error name: <span className='plasmo-text-red-500 plasmo-font-semibold'>{error.name}</span></p>
<p className='plasmo-text-sm plasmo-font-light plasmo-text-red-500'>{error.message}</p>

  </div>}


      </div>
  )
}

export default UnloggedScreen