import {  TextArea } from '@radix-ui/themes'
import { ethers } from 'ethers';
import React, { useState } from 'react'
import { redirect } from 'react-router-dom';
import { useAppDispatch } from '../state-managment/ReduxWrapper';
import { setCurrentWallet } from '../state-managment/slices/LoggedInWallet';
import { saveKey } from '../IndexedDB/WalletDataStorage';
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
type Props = {}

function RestoreWallet({}: Props) {
  const [isValidSeed, setIsValidSeed]=useState<boolean>(false);
 
  const restoreWalletSchema=z.object({
    password:z.string({error:"Invalid type"}).min(12, {error:'The password has to be at least 12 characters long.'}),
recoveryPhrase: z.string({'error':'Invalid Type'}).refine((string)=>string.trim().split(' ').length === 12,{error:'The Mnemnonic has to contain 12 words.'})
  });


  const {trigger, formState, register, reset, watch, handleSubmit}=useForm<z.infer<typeof restoreWalletSchema>>({
    resolver:zodResolver(restoreWalletSchema)
  });

  
  const dispatch = useAppDispatch();

  const validateTheWallet= async (e)=>{
    e.preventDefault();

   try{

   const triggerResult = await trigger('recoveryPhrase');

    console.log(triggerResult);


    if(formState.errors.recoveryPhrase && formState.errors.recoveryPhrase.message && formState.errors.recoveryPhrase.message.trim().length > 0){
alert(`Error: ${formState.errors.recoveryPhrase.message}`);
return;
    }

    const isValid = watch('recoveryPhrase').trim().split(' ').every(word => /^[a-zA-Z]+$/.test(word));
    if (!isValid) {
      alert("Recovery phrase contains invalid characters.");
      return;
    }

const wallet = ethers.Wallet.fromPhrase(watch('recoveryPhrase'));

if(wallet){
  setIsValidSeed(true);
  
  console.log('Restored Wallet Details:', wallet);
  alert("Wallet Recovery is valid, now set the password.");
return;
}

alert('Error ! Something went wrong with restoring the wallet.')

   }catch(err){
console.log(err);
   }

  }


  const restoreWallet = async () => {
try {
  console.log(formState.errors);

  if(
    formState.errors.password &&
    formState.errors.password.message && formState.errors.password.message.length !== 0){
  return;
}


  const wallet = ethers.Wallet.fromPhrase(watch('recoveryPhrase')); 

  if(!wallet){
    alert('No such wallet exists');
    return;
  }


console.log('Restored Wallet Address:', wallet.address);
console.log('Restored Wallet Private Key:', wallet.privateKey);


const encryptedWallet= await wallet.encrypt(watch('password'));

const encryptedPassword= bcrypt.hashSync(watch('password'), 10);


await saveKey(`keystore-${wallet.address}`, {encryptedWallet, password:encryptedPassword});

  await saveKey('session', {
        encryptedWallet, 
        account:wallet.address,
        loggedAt: Date.now(),
        expiresAt: Date.now() + 2 * 1000 * 60 * 60,
        approvedOrigins:[],
        password: encryptedPassword,
      });

dispatch(
  setCurrentWallet({
    'address': wallet.address,
    'encryptedWallet':encryptedWallet,
    password: encryptedPassword,
  })
);
redirect('/');
alert('Wallet restored successfully!');

  
} catch (error) {
  console.log(error)
}
  }


  return (
    <form
    onSubmit={handleSubmit(async()=>{await restoreWallet();},(err)=>{
      alert(`${Object.values(err).map((errorEl)=>`${errorEl.message} \n`)}`)
      console.log(err);
      return;
    })}
    className='plasmo-w-full
plasmo-flex plasmo-flex-col plasmo-gap-3
    '>
      {!isValidSeed &&       
      <>
<p
className='plasmo-text-base plasmo-font-semibold plasmo-text-secondary'
>Enter your recovery phrase:</p>
<TextArea
{...register('recoveryPhrase')}
placeholder='Recovery phrase...'
className='plasmo-h-24'
/>



<button
onClick={validateTheWallet}
className="plasmo-bg-secondary flex plasmo-items-center plasmo-text-center plasmo-justify-center plasmo-border  plasmo-border-accent
        plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-2 plasmo-text-primary
         hover:plasmo-border-secondary hover:plasmo-text-white
         hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500
         "
>
    Validate Seed
</button>
      </>
      }


{isValidSeed && 
<>
<p
className='plasmo-text-base plasmo-font-semibold plasmo-text-secondary'
>Enter Your Password:</p>
<input
{...register('password')}

placeholder='Recovery phrase...'
className='plasmo-bg-accent plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>

<button
type='submit'
onClick={restoreWallet}
className="plasmo-bg-secondary flex plasmo-items-center plasmo-text-center plasmo-justify-center plasmo-border  plasmo-border-accent
        plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-2 plasmo-text-primary
         hover:plasmo-border-secondary hover:plasmo-text-white
         hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500
         "
>
    Restore Wallet
</button>
</>
}


    </form>
  )
}

export default RestoreWallet