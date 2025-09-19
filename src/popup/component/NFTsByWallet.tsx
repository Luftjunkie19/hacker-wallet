import React, { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { PiFlyingSaucerFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { SiOpensea } from "react-icons/si";
import useFetchNftData from '~popup/hooks/useFetchNftData';
import ERC721AddModal from './modals/Modal';
import Modal from './modals/Modal';
import { ethers } from 'ethers';
import { erc721Abi } from '~popup/abis/ERC721';
import { saveErc721Token } from '~popup/IndexedDB/tokensStorage';
type Props = {}

function NFTsByWallet({}: Props) {
  const {elements:nftElements, isLoading
  } =useFetchNftData();
    const publicAddress=useAppSelector((state)=>state.loggedIn.address);
    const rpcURL=useAppSelector((state)=>state.currentNetworkConnected.rpcURL);
    const encryptedPrivateKey=useAppSelector((state)=>state.loggedIn.encryptedWallet);
    const [tokenAddress, setTokenAddress]=useState<`0x${string}`>();
    const [tokenId, setTokenId]=useState<BigInt>();

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


        const wallet= ethers.Wallet.fromEncryptedJsonSync(encryptedPrivateKey as string, "[password]");

        const decryptedWallet = new ethers.Wallet(wallet.privateKey, provider);

        const nftTokenAbiInterface= new ethers.Interface(erc721Abi);

        const contract= new ethers.Contract(tokenAddress, nftTokenAbiInterface, decryptedWallet);

        const ownerOf = await contract.ownerOf(tokenId);
        
        if(ownerOf !== publicAddress){
          alert("You are not the owner !");
          return;
        }


        const tokenURI= await contract.tokenURI(tokenId);

        console.log(ownerOf, tokenURI);

        const fetchOfObject= await fetch(`${(tokenURI as string).replace('ipfs://', 'https://dweb.link/ipfs/')}`);

        const fetchData = await fetchOfObject.json();


        await saveErc721Token(`erc721-${tokenId}`,{
          description:fetchData.description,
          image:fetchData.image,
          tokenName:fetchData.name,
          tokenId,
        });

      } catch (error) {
        console.log(error);
      }
    }

  return (
    <>
<Modal>
  <div className='plasmo-flex plasmo-flex-col plasmo-h-full plasmo-gap-3 plasmo-p-2'>

<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
  <p className='plasmo-text-white'>Token Address</p>
  <input
onChange={(e) => {
  setTokenAddress(e.target.value as `0xstring`);
}}
value={tokenAddress}
placeholder='Token Address...'
className='plasmo-bg-accent plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>
</div>


<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
  <p className='plasmo-text-white'>Token Id</p>
  <input
  type='number'
onChange={(e) => {
  setTokenId(BigInt(+e.target.value));
}}
step={1}
min={1}
placeholder='Token ID...'
className='plasmo-bg-accent plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>



</div>

<button 
onClick={handleLoadCheckOwnership}
className='plasmo-bg-secondary plasmo-mt-6 plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'

>Load the data</button>

  </div>
</Modal>

    {publicAddress && nftElements && nftElements.length > 0 &&
      <div className='plasmo-grid plasmo-grid-cols-3 plasmo-gap-4 '> 
      {nftElements.map((element, index)=>(<div>
        <p>NFT Element !</p>

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
   publicAddress && nftElements && nftElements.length === 0 && <div className='plasmo-w-full plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-3 plasmo-py-3'>
      <p className='plasmo-text-white plasmo-text-center'>No NFTs Owned Yet</p>
      <PiFlyingSaucerFill className='plasmo-text-secondary plasmo-text-6xl'/>
      <p className='plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-text-white'>Start Exploring NFT World on <Link to={'https://opensea.io/'} target='_blank'><SiOpensea className='plasmo-text-secondary plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-2xl'/></Link></p>
      </div>}



      </>
  )
}

export default NFTsByWallet