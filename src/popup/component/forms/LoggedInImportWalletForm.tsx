import React, { useState } from 'react'
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { useForm } from 'react-hook-form';
import { TextArea } from '@radix-ui/themes';

function LoggedInImportWalletForm(){
const sessionPassword= useAppSelector((state)=>state.loggedIn.password);

 const importWalletSchema= z.object({
       importOption: z.string().refine((input)=> input === 'mnemonic' || input === 'private-key',{'error':'Invalid Option Selected'}).default('mnemonic'),
        privateKey:z.string().startsWith('0x').length(66,{
            'error':'Invalid Private-key provided',

        }),
        recoveryPhrase: z.string({'error':'Invalid Type'}).refine((string)=>string.trim().split(' ').length === 12,{error:'The Mnemnonic has to contain 12 words.'}),
        password: z.string().min(12, {'error':'The Length is invalid'}).refine(async(input)=> bcrypt.compareSync(input, sessionPassword), {
            'error':'Password is Invalid :)'
        })
    }).refine((option)=> (option.importOption === 'mnemonic' && option.recoveryPhrase.trim().split(' ').length === 12) || (option.importOption === 'private-key' && option.privateKey.startsWith('0x') && option.privateKey.trim().length === 66),{
        'error':'Invalid Recovery Option Input',
    });
  
    const {
        handleSubmit,
        register,
        formState,
        setValue,
        trigger,
        watch
    }=useForm<z.infer<typeof importWalletSchema>>();

    const handleImportWallet= async ()=>{
        try {

            console.log(formState);
            
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
<button
className='plasmo-text-white'
onClick={()=>{
if(watch('importOption') === 'private-key'){
    setValue('importOption', 'mnemonic');
    return;
}
setValue('importOption', 'private-key');
}}>
Import by {watch('importOption') === 'private-key' ? ' Mnemonic' : 'Private Key'}
</button>
<p className='plasmo-text-secondary plasmo-font-semibold'>{watch('importOption') === 'private-key' ? ' Private Key' : 'Mnemonic'}</p>

<textarea
className='plasmo-rounded-lg plasmo-border-secondary plasmo-border-2 plasmo-w-full plasmo-bg-accent plasmo-text-white plasmo-p-1 plasmo-h-24 placeholder:plasmo-text-white
'
{...(watch('importOption')
     === 'private-key' ? register('privateKey') : register('recoveryPhrase'))} 

placeholder={watch('importOption')
     === 'private-key' ? 'Enter Private Key...' : 'Enter Mnemonic'
}

/>

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
placeholder={'Enter Password'}

/>
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