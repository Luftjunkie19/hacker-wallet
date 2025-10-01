import React from 'react'
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ethers } from 'ethers';
import { saveKey } from '~popup/IndexedDB/WalletDataStorage';

type Props = {
    onClose?: ()=>void
}
function LoggedInImportWalletForm({onClose}: Props){
const sessionPassword= useAppSelector((state)=>state.loggedIn.password);


 const importWalletSchema= z.object({
        recoveryPhrase: z.string({'error':'Invalid Type'}).refine((string)=> string.trim().split(' ').length === 12 || string.trim().split(' ').length === 15 || string.trim().split(' ').length === 18 || string.trim().split(' ').length === 21 || string.trim().split(' ').length === 24,{error:'The Mnemnonic has to contain (12, 15, 18, 21 or 24) words.'}),
        password: z.string().min(12, {'error':'The Length is invalid'}).refine(async(input)=> bcrypt.compareSync(input, sessionPassword), {
            'error':'Password is Invalid with the one you provided :)'
        })
    });
    
  
    const {
        handleSubmit,
        register,
        formState,
        setValue,
        getValues,reset,
        watch,
    }=useForm<z.infer<typeof importWalletSchema>>({
        'defaultValues':{
            'password':'',
            'recoveryPhrase':''
        },
        resolver: zodResolver(importWalletSchema)
    });

    const handleImportWallet= async ()=>{
        try {

            console.log(formState.errors, getValues());

            const importWalletFromMnemonic =  ethers.Wallet.fromPhrase(watch('recoveryPhrase'));

            const encryptedJson = await importWalletFromMnemonic.encrypt(watch('password'));

            await saveKey(`keystore-${importWalletFromMnemonic.address}`, {
                'address': importWalletFromMnemonic.address,
                'encryptedWallet': encryptedJson,
                'password': bcrypt.hashSync(watch('password'), 10),
            });

            alert('Wallet Imported Successfully!');

            reset();
            
            onClose();
            
        } catch (error) {
            console.log(error);
        }

    }


return (
    <form
className='plasmo-w-full plasmo-flex plasmo-flex-col plasmo-gap-3 plasmo-h-full plasmo-justify-between
'
    onSubmit={handleSubmit(handleImportWallet,(errors)=>{
        console.log(errors);
    })}
    >
<div
className='plasmo-w-full plasmo-flex plasmo-flex-col plasmo-gap-3'>
<div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-full">
<p className='plasmo-text-secondary plasmo-font-semibold'>Mnemonic</p>

<textarea
className='plasmo-rounded-lg plasmo-border-secondary plasmo-border-2 plasmo-w-full plasmo-bg-accent plasmo-text-white plasmo-p-1 plasmo-h-24 placeholder:plasmo-text-white
'
{...register('recoveryPhrase')} 

placeholder={'Enter Mnemonic...'}
value={watch('recoveryPhrase')}
onChange={(e)=> setValue('recoveryPhrase', e.target.value)}
/>


{formState.errors.recoveryPhrase &&
<p className='plasmo-text-red-500 plasmo-text-sm plasmo-font-semibold'>
{formState.errors.recoveryPhrase.message}
</p>}

    </div>

    <div className="
    plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-full
    ">
<p className='plasmo-text-secondary plasmo-font-semibold'>
Password
</p>

<input
className='plasmo-rounded-lg plasmo-border-secondary plasmo-border-2 plasmo-w-full plasmo-bg-accent plasmo-text-white plasmo-p-2
placeholder:plasmo-text-white'
{...register('password')}
placeholder={'Enter Password....'}

/>
{formState.errors.password &&
<p className='plasmo-text-red-500 plasmo-font-semibold plasmo-text-sm'>
{formState.errors.password.message}
</p>
}
    </div>
</div>

<button 
type='submit'
className='plasmo-bg-secondary plasmo-text-accent plasmo-p-2 plasmo-rounded-lg hover:plasmo-bg-primary hover:plasmo-text-white
hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500'>
    Confirm
</button>

    </form>
  )
}

export default LoggedInImportWalletForm