import React, { useEffect, useState } from 'react'
import {generateMnemonic, mnemonicToSeedSync} from 'bip39'
import { Button } from '@radix-ui/themes';
import { Label } from '@radix-ui/themes/dist/cjs/components/context-menu';



type Props = {}

function CreateNewWallet({}: Props) {
  const [confirmInput, setConfirmInput] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [indicies, setIndices] = useState<Set<number>>(new Set());
  const [mnemonic, setMnemonic] = useState<string>();
  const [inputPhrase, setInputPhrase] = useState<string>('');

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
    const seed = mnemonicToSeedSync(mnemonic);
    console.log('Seed:', seed.toString('hex'));
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

  return (
      <div className='plasmo-flex plasmo-flex-col plasmo-gap-4  plasmo-w-full
      '>
      {mnemonic && !confirmInput &&
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

      {confirmInput && mnemonic && 
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
      mnemonic && !confirmInput && <>    
      <Button
      onClick={
        () => {
          navigator.clipboard.writeText(mnemonic);
        }
      }

      className='
      plasmo-max-w-36
      plasmo-bg-accent plasmo-border-secondary plasmo-border-2 plasmo-cursor-pointer
      '
      >
        Copy to Clipboard
      </Button>

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
      

      {mnemonic && confirmInput && 
      <Button
      className='
      plasmo-bg-secondary flex plasmo-items-center plasmo-text-center plasmo-justify-center plasmo-border  plasmo-border-accent
      plasmo-font-semibold plasmo-text-sm plasmo-rounded-lg plasmo-px-4 plasmo-py-3 plasmo-text-primary
      hover:plasmo-border-secondary hover:plasmo-text-white
      hover:plasmo-bg-accent hover hover:plasmo-scale-95 plasmo-transition-all plasmo-duration-500
      plasmo-w-full plasmo-cursor-pointer
      '
      onClick={() => {
        if(
          mnemonic.split(' ')[currentStep] === inputPhrase.trim()
        ){
          const nextIndex = Array.from(indicies)[Array.from(indicies).indexOf(currentStep) + 1];
          if (nextIndex !== undefined) {
            setCurrentStep(nextIndex);
            setInputPhrase('');
          }
        } else {
          console.log('Error: No more indices to confirm.');
          alert('Incorrect word, please try again.');
          // Reset state or proceed to the next step in your app
          setConfirmInput(false);
          setIndices(new Set());
          setCurrentStep(0);
          setMnemonic(undefined); // Optionally generate a new mnemonic
        }

      }}

      >
        Next
      </Button>
      }




      
      </div>
  )
}


export default CreateNewWallet