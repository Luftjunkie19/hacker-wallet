import React, { useEffect, useState } from 'react'
import {generateMnemonic, mnemonicToSeedSync} from 'bip39'
import { Button } from '@radix-ui/themes';
import {Toast} from 'radix-ui';
import {ethers} from 'ethers';
import { useAppDispatch } from './state-managment/ReduxWrapper';
import { setCurrentWallet } from './state-managment/slices/LoggedInWallet';
import { redirect } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { IoMdEyeOff } from "react-icons/io";
import bcrypt from 'bcryptjs'
import { saveKey } from './IndexedDB/walletStorage';

type Props = {}

function CreateNewWallet({}: Props) {
  const [confirmInput, setConfirmInput] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [indicies, setIndices] = useState<Set<number>>(new Set());
  const [mnemonic, setMnemonic] = useState<string>();
  const [open, setOpen] = useState(false);
  const [inputPhrase, setInputPhrase] = useState<string>('');
  const [confirmedSeed, setConfirmedSeed]=useState<boolean>();
  const [password, setPassword]=useState<string>();
  const [type, setType]=useState<"password" | "text">("password");

  const dispatch = useAppDispatch();

useEffect(() => {
    if(!mnemonic){
       const getMnemonic = () => {
           const mnemonic =  generateMnemonic();
           setMnemonic(mnemonic);
       };
       getMnemonic();
    }
},[mnemonic]);

const handleConfirm = () => {
  if (mnemonic) {

    const lengthOfMnemonic = mnemonic.split(' ').length;
    const indiciesToConfirm = new Set<number>();

    while (indiciesToConfirm.size < 3) {
      const randomIndex = Math.floor(Math.random() * lengthOfMnemonic);
      indiciesToConfirm.add(randomIndex);
    }

    setIndices(indiciesToConfirm);
    setConfirmInput(true);
    setCurrentStep(Array.from(indiciesToConfirm)[0]);


    console.log('Indices to confirm:', indiciesToConfirm);
    console.log('Mnemonic:', mnemonic);
  }
};

const handleCheckMnemonicWords=() => {
  if(Array.from(indicies).indexOf(currentStep) !== indicies.size - 1){
    if(mnemonic.split(' ')[currentStep] === inputPhrase.trim()){
            const nextIndex = Array.from(indicies)[Array.from(indicies).indexOf(currentStep) + 1];
            console.log(nextIndex, "next index");
            if (nextIndex !== undefined) {
              setCurrentStep(nextIndex);
              setInputPhrase('');
            }
          } else {
            alert('Incorrect word, please try again.');
            // Reset state or proceed to the next step in your app
            setConfirmInput(false);
            setIndices(new Set());
            setCurrentStep(0);
            setInputPhrase('');
          }
    return;
  }

    
      alert('Mnemonic confirmed! Your wallet is created.');
      setConfirmedSeed(true);

      };



const encryptAndLoginWallet= async ()=>{
    try{
 if ((ethers).Wallet && (ethers).Wallet.fromPhrase && password.trim().length >= 12) {
  console.log("Wallet.fromPhrase exists");
  const hdNode = (ethers).Wallet.fromPhrase(mnemonic);
      console.log(hdNode);
      console.log('Wallet Address:', hdNode.address);
      console.log('Private Key:', hdNode.privateKey);
      const wallet = new ethers.Wallet(hdNode.privateKey);
    
      const encryptedWallet= await hdNode.encrypt(password);

      console.log('encrypted wallet', encryptedWallet);

      console.log('Wallet Details:', wallet);

      const encryptedPassword = bcrypt.hashSync(password,10);

      console.log(encryptedPassword);

      await saveKey(`keystore-${wallet.address}`, {
        encryptedWallet,
        password: encryptedPassword
      });

      await saveKey('session', {
        encryptedWallet, 
        account:wallet.address,
        loggedAt: Date.now(),
        expiresAt: Date.now() + 2 * 1000 * 60 * 60,
        approvedOrigins:[],
      });

      dispatch(setCurrentWallet({
        'encryptedWallet': encryptedWallet,
        address: wallet.address,
      }));
    
      redirect('/');

      return; 
}

throw new Error("Wallet.fromPhrase does not exist");

    }catch(error){
      console.error('Error creating wallet:', error);
      alert(`There was an error creating your wallet. Please try again.
        ${error}
        `);
    }




}


  return (
      <div className='plasmo-flex plasmo-flex-col plasmo-gap-4  plasmo-w-full
      '>
      {mnemonic && !confirmInput &&  !confirmedSeed &&
      <>
        <p
        className='plasmo-text-white plasmo-text-lg plasmo-font-semibold
        '
        >Here is your freshly generated mnemonic:</p>
        
        <div className='plasmo-grid plasmo-w-full
        plasmo-grid-cols-4 plasmo-gap-4'>
{mnemonic.split(' ').map((word, index) => (
   
        <div key={index} className='plasmo-text-secondary
        plasmo-col-span-1
        plasmo-text-base plasmo-text-center plasmo-bg-accent plasmo-rounded-lg'>{word}</div>
  
      ))}
      
      </div>
      </>}

      {confirmInput && mnemonic &&  !confirmedSeed &&
      <div>
        <p
        className='plasmo-text-white plasmo-text-lg plasmo-font-semibold
        '
        >What is the {currentStep + 1} word of your mnemonic?</p>

<input
className='plasmo-w-full plasmo-bg-accent plasmo-text-white plasmo-rounded-lg plasmo-px-4 plasmo-py-2'
type="text"
placeholder='Type here...'
onChange={(e) => {
  setInputPhrase(e.target.value);
}}
value={inputPhrase}
/>
       
      </div>
      }




{
      mnemonic && !confirmInput && !confirmedSeed && <>    

	<Toast.Provider swipeDirection="right">

          <Button
      	onClick={() => {
        navigator.clipboard.writeText(mnemonic);
        setOpen(true);
				}}

      className='
      plasmo-max-w-36
      plasmo-bg-accent plasmo-border-secondary plasmo-border-2 plasmo-cursor-pointer
      '
      >
        Copy to Clipboard
      </Button>

			<Toast.Root className="
      plasmo-w-full plasmo-p-2 plasmo-flex plasmo-items-center plasmo-gap-4
      " open={open} onOpenChange={setOpen}>
				<Toast.Title className="
        plasmo-text-white plasmo-font-semibold
        ">Mnemonic Copied !</Toast.Title>
				<Toast.Action
					className="ToastAction"
					asChild
					altText="Goto schedule to undo"
				>
					<button className="
          plasmo-text-red-500 plasmo-font-light plasmo-underline plasmo-cursor-pointer
          ">Undo</button>
				</Toast.Action>
			</Toast.Root>
			<Toast.Viewport className="ToastViewport" />
		</Toast.Provider>


<div className='
plasmo-py-6 plasmo-w-full
'>

<button
onClick={
  handleConfirm
}

className="plasmo-bg-secondary flex plasmo-items-center plasmo-text-center plasmo-justify-center plasmo-border  plasmo-border-accent
        plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-2 plasmo-text-primary
         hover:plasmo-border-secondary hover:plasmo-text-white
         hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500
       plasmo-w-full
         "
>
    Confirm
</button>

</div>
      </>
}
      

      {mnemonic && confirmInput && !confirmedSeed &&
      <Button
      className='
      plasmo-bg-secondary flex plasmo-items-center plasmo-text-center plasmo-justify-center plasmo-border  plasmo-border-accent
      plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-3 plasmo-text-primary
      hover:plasmo-border-secondary hover:plasmo-text-white
      hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500
      plasmo-w-full plasmo-cursor-pointer
      '
      onClick={handleCheckMnemonicWords}
      >
        Next
      </Button>
      }


{confirmedSeed && <>
   <div>
        <p className='plasmo-text-white plasmo-text-lg plasmo-font-semibold'>
          Set the password for your wallet.
        </p>

<div className='plasmo-flex plasmo-items-center plasmo-gap-3'>
<input
className='plasmo-w-full plasmo-bg-accent plasmo-text-white plasmo-rounded-lg plasmo-px-4 plasmo-py-2'
type={type}
placeholder='Type here...'
onChange={(e) => {
  setPassword(e.target.value);
}}
value={password}
/>

<button onClick={()=>{
  if(type==='text') {
    setType("password");
    return;
  }
  setType('text');
}}>
  {type === 'password' ?
<FaEye className='plasmo-text-secondary plasmo-text-xl'/> : 
<IoMdEyeOff className='plasmo-text-secondary plasmo-text-xl' />

}
</button>
</div>
       
      </div>

    <Button
      className='
      plasmo-bg-secondary flex plasmo-items-center plasmo-text-center plasmo-justify-center plasmo-border  plasmo-border-accent
      plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-3 plasmo-text-primary
      hover:plasmo-border-secondary hover:plasmo-text-white
      hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500
      plasmo-w-full plasmo-cursor-pointer
      '
      onClick={encryptAndLoginWallet}
      >
        Next
      </Button>

</>}



      
      </div>
  )
}


export default CreateNewWallet