import React, { useCallback, useEffect, useState } from 'react'
import { FaClipboard } from 'react-icons/fa';
import { PiFlyingSaucerFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import useFetchTokensData from '~popup/hooks/useFetchTokensData';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
import Modal from './modals/Modal';
import { ethers } from 'ethers';

type Props = {}

function TokensByWallet({}: Props) {
    const publicAddress=useAppSelector((state)=>state.loggedIn.address);
    const {tokens,isLoading}=useFetchTokensData();

const handleLoadCheckOwnership= async ()=>{

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

        const nftTokenAbiInterface= new ethers.Interface(erc721Abi);

        const contract= new ethers.Contract(tokenAddress, nftTokenAbiInterface, decryptedWallet);


        const ownerOf = await contract.ownerOf(tokenId);
        
        if(ownerOf !== publicAddress){
          alert("You are not the owner !");
          return;
        }

        console.log(ownerOf, tokenURI);

        const fetchOfObject= await fetch(`${(tokenURI as string).replace('ipfs://', 'https://dweb.link/ipfs/')}`);

        const fetchData = await fetchOfObject.json();


        await saveKey(`erc20-${tokenAddress}`,{
          description:fetchData.description,
          image:fetchData.image,
          tokenName:fetchData.name,
          tokenId,
          chainId, 
          currentNetworkAlchemyId,
          nftAddress:tokenAddress
        });

        alert('Congratulations, you have successfully, imported your NFT !')
import { bcrypt } from 'bcryptjs';

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
placeholder='Token Address...'
className='plasmo-bg-accent plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>
</div>


<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
  <p className='plasmo-text-white'>Token Id</p>
  <input
  type='number'
step={1}
min={1}
placeholder='Token ID...'
className='plasmo-bg-accent plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>



</div>

<button className='plasmo-bg-secondary plasmo-mt-6 plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'>
  Confirm
  </button>
</>
  </div>
</Modal>


 {publicAddress && tokens && tokens.length > 0 &&
      <div className='plasmo-flex plasmo-flex-col plasmo-w-full plasmo-h-64 plasmo-gap-4 plasmo-overflow-y-auto plasmo-bg-primary'> 
      {tokens.map((element, index)=>(<div className='plasmo-w-full plasmo-bg-accent plasmo-p-2 plasmo-rounded-lg plasmo-flex plasmo-items-center plasmo-justify-between'>
        <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
    <p className='plasmo-text-white plasmo-line-clamp-1'>{element.tokenMetadata.name ?? "Ether"}  ({element.tokenMetadata.symbol ?? "ETH"})</p>
    <button onClick={()=>navigator.clipboard.writeText(element.tokenAddress)} className='plasmo-text-sm plasmo-w-fit plasmo-p-1 plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-secondary'>
    <FaClipboard />
        Copy address
        </button>
        </div>

<div>
    <p className='plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-white plasmo-font-semibold'>{((Number(element.tokenBalance)) /  (10 ** (element.tokenMetadata.decimals ?? 18))).toFixed(2)} <span className='plasmo-text-secondary'>{element.tokenMetadata.symbol ?? "ETH"}</span></p>
</div>

     </div>))}
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