import {  TextArea } from '@radix-ui/themes'
import { ethers } from 'ethers';
import React, { useState } from 'react'
import { redirect } from 'react-router-dom';
import { useAppDispatch } from './state-managment/ReduxWrapper';
import { setCurrentWallet } from './state-managment/slices/LoggedInWallet';
import { saveKey } from './IndexedDB/walletStorage';
import bcrypt from 'bcryptjs';

type Props = {}

function RestoreWallet({}: Props) {
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');
  const [isValidSeed, setIsValidSeed]=useState<boolean>(false);
  const [password, setPassword]=useState<string>();

  const dispatch = useAppDispatch();

  const validateTheWallet=()=>{
    const words = recoveryPhrase.trim().split(" "); 
    if (words.length !== 12) {
      alert("Recovery phrase must be 12 words.");
      return;
    }

    const isValid = words.every(word => /^[a-zA-Z]+$/.test(word));
    if (!isValid) {
      alert("Recovery phrase contains invalid characters.");
      return;
    }

const wallet = ethers.Wallet.fromPhrase(recoveryPhrase);

console.log('Restored Wallet Details:', wallet);
setIsValidSeed(true);
alert("Wallet Recovery is valid, now set the password.");
  }


  const restoreWallet = async () => {
const wallet = ethers.Wallet.fromPhrase(recoveryPhrase); 

console.log('Restored Wallet Address:', wallet.address);
console.log('Restored Wallet Private Key:', wallet.privateKey);

const encryptedWallet= await wallet.encrypt(password);

alert('Wallet restored successfully!');

const encryptedPassword= bcrypt.hashSync(password, 10);

await saveKey(`keystore-${wallet.address}`, {encryptedWallet, password:encryptedPassword});

await saveKey(`session`, {
  encryptedWallet, 
        account:wallet.address,
        loggedAt: Date.now(),
        expiresAt: Date.now() + 2 * 1000 * 60 * 60,
        approvedOrigins:[],
});


dispatch(
  setCurrentWallet({
    'address': wallet.address,
    'encryptedWallet':encryptedWallet,
  })
);
redirect('/restore');
  }


  return (
    <div className='plasmo-w-full
plasmo-flex plasmo-flex-col plasmo-gap-3
    '>
      {!isValidSeed &&       
      <>
<p
className='plasmo-text-base plasmo-font-semibold plasmo-text-secondary'
>Enter your recovery phrase:</p>
<TextArea
onChange={(e) => {
  setRecoveryPhrase(e.target.value);
}}
value={recoveryPhrase}
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
    Validate
</button>
      </>
      }


{isValidSeed && 
<>
<p
className='plasmo-text-base plasmo-font-semibold plasmo-text-secondary'
>Enter your recovery phrase:</p>
<TextArea
onChange={(e) => {
  setPassword(e.target.value);
}}
value={recoveryPhrase}
placeholder='Recovery phrase...'
className='plasmo-h-24'
/>

<button
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


    </div>
  )
}

export default RestoreWallet