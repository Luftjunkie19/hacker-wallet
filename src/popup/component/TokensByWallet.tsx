import React, { useCallback, useEffect, useState } from 'react'
import { FaClipboard } from 'react-icons/fa';
import { PiFlyingSaucerFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import useFetchTokensData from '~popup/hooks/useFetchTokensData';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
import Modal from './modals/Modal';
import { ethers } from 'ethers';
import { saveKey } from '~popup/IndexedDB/WalletDataStorage';
import { erc20Abi } from '~popup/abis/ERC20';
import bcrypt from 'bcryptjs';
import Erc20Element from './elements/Erc20Tokens/home/Erc20Element';

type Props = {}

function TokensByWallet({}: Props) {
    const publicAddress=useAppSelector((state)=>state.loggedIn.address);
    const [tokenAddress, setTokenAddress]=useState<`0x${string}`>();
    const [password, setPassword]=useState<string>();
    const accountPassword =useAppSelector((state)=>state.loggedIn.password);
    const encryptedPrivateKey=useAppSelector((state)=>state.loggedIn.encryptedWallet);
    const rpcURL=useAppSelector((state)=>state.currentNetworkConnected.rpcURL);
    const {tokens,isLoading}=useFetchTokensData();

const handleUploadERC20Token = async ()=>{

      try {
        if(tokenAddress.length !== 42 || !tokenAddress.startsWith('0x')){
          alert('Not able to load, wrong token address');
        return;
        }

        if(!publicAddress || !encryptedPrivateKey){
          alert('No Public address');
          return;
        }

        const provider = new ethers.JsonRpcProvider(rpcURL);

        const accountPswdDecrypted = await bcrypt.compare(password, accountPassword);

        if(!accountPswdDecrypted){
          alert('Invalid Password, sorry wypierdalaj !');
          return;
        }

        const wallet= ethers.Wallet.fromEncryptedJsonSync(encryptedPrivateKey as string, password);

        const decryptedWallet = new ethers.Wallet(wallet.privateKey, provider);

        const erc20AbiInterface = new ethers.Interface(erc20Abi);

        const contract= new ethers.Contract(tokenAddress, erc20AbiInterface , decryptedWallet);

        console.log(contract);

        if(!contract){
          alert('Sorry Bro, such contract does not exist !');
          return;
        }

        await saveKey(`erc20-${tokenAddress}`,{
          tokenAddress
        });

        alert('Congratulations, you have successfully, imported your ERC20 !')


      } catch (error) {
        alert(error);
        console.log(error);
      }
    }

  return (
    <>
<Modal title='Load ERC20 Token'>
  <div className='plasmo-flex plasmo-flex-col plasmo-h-full plasmo-gap-3 plasmo-p-2'>
<>
<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
  <p className='plasmo-text-white'>Token Address</p>
  <input
  onChange={(e)=>setTokenAddress(e.target.value as `0x${string}`)}
placeholder='Token Address...'
className='plasmo-bg-accent plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>
</div>



<button
onClick={handleUploadERC20Token}
 className='plasmo-bg-secondary plasmo-mt-6 plasmo-rounded-lg 
 plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent 
 hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'>
  Confirm
  </button>
</>
  </div>
</Modal>


 {publicAddress && tokens && tokens.length > 0 &&
      <div className='plasmo-flex plasmo-flex-col plasmo-w-full plasmo-h-64 plasmo-gap-4 plasmo-overflow-y-auto plasmo-bg-primary'> 
      {tokens.map((element, index)=>(
        <Erc20Element tokenAmount={((Number(element.tokenBalance)) /  (10 ** (element.tokenMetadata.decimals ?? 18))).toFixed(2)} 
        tokenAddress={element.tokenAddress}
        symbol={element.tokenMetadata.symbol}
        tokenName={element.tokenMetadata.name}
        />
      ))}
    </div>
      }


{
  isLoading && <div
  className='
  plasmo-text-secondary plasmo-text-center plasmo-py-4
  '
  >

    Loading...
  </div>
}


        {
       !isLoading &&
        tokens && tokens.length === 0 && publicAddress && <div className='plasmo-w-full plasmo-flex plasmo-flex-col plasmo-p-2 plasmo-gap-2 plasmo-items-center plasmo-justify-center'>           
      <p className='plasmo-text-white plasmo-text-center'>No Coins nor Tokens Owned Yet</p>
      <PiFlyingSaucerFill className='plasmo-text-secondary plasmo-text-6xl'/>
      <p className='plasmo-text-center plasmo-text-white'>Start Exploring Coins and Tokens on 
        <Link className='plasmo-text-pink-500 hover:plasmo-underline plasmo-pl-1' to={'https://app.uniswap.org/'} target='_blank'>Uniswap</Link>
        </p>
        </div>}


    </>
  )
}

export default TokensByWallet