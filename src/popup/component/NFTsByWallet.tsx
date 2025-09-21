import React, { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { PiFlyingSaucerFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { SiOpensea } from "react-icons/si";
import useFetchNftData from '~popup/hooks/useFetchNftData';
import Modal from './modals/Modal';
import { ethers } from 'ethers';
import { erc721Abi } from '~popup/abis/ERC721';
import { saveKey, fetchContainingKeywordElements} from '~popup/IndexedDB/WalletDataStorage';
import bcrypt from 'bcryptjs';
import { IoEyeOff } from 'react-icons/io5';
import { FaEye } from 'react-icons/fa';
type Props = {}

function NFTsByWallet({}: Props) {
  const {elements:nftElements, isLoading
  } =useFetchNftData();
    const publicAddress=useAppSelector((state)=>state.loggedIn.address);
    const rpcURL=useAppSelector((state)=>state.currentNetworkConnected.rpcURL);
    const chainId =useAppSelector((state)=>state.currentNetworkConnected.chainId);
    const currentNetworkAlchemyId =useAppSelector((state)=>state.currentNetworkConnected.networkAlchemyId);
    const encryptedPrivateKey=useAppSelector((state)=>state.loggedIn.encryptedWallet);
    const accountPassword=useAppSelector((state)=>state.loggedIn.password);
    const [tokenAddress, setTokenAddress]=useState<`0x${string}`>();
    const [tokenId, setTokenId]=useState<BigInt>();
    const [nextStep, setNextStep]=useState<boolean>(false);
    const [inputType, setInputType]=useState<'text'|'password'>('text');
    const [password, setPassword]=useState<string>();

    const [importedNfts, setImportedNfts]=useState<any[]>([]);

const fetchERC721s= useCallback(async ()=>{
  const elements= await fetchContainingKeywordElements();

  console.log((elements as unknown as any[]).filter((element)=> typeof element.nftAddress === 'string' ));

  setImportedNfts((elements as unknown as any[]).filter((element)=> typeof element.nftAddress === 'string' ));
},[]);

useEffect(()=>{
  fetchERC721s();
},[])

   

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


        const tokenURI= await contract.tokenURI(tokenId);

        console.log(ownerOf, tokenURI);

        const fetchOfObject= await fetch(`${(tokenURI as string).replace('ipfs://', 'https://dweb.link/ipfs/')}`);

        const fetchData = await fetchOfObject.json();


        await saveKey(`erc721-${tokenAddress}-${tokenId}`,{
          description:fetchData.description,
          image:fetchData.image,
          tokenName:fetchData.name,
          tokenId,
          chainId, 
          currentNetworkAlchemyId,
          nftAddress:tokenAddress
        });

        alert('Congratulations, you have successfully, imported your NFT !')

      } catch (error) {
        alert(error);
        console.log(error);
      }
    }

  return (
    <>
<Modal title='Load Your NFT (ERC721)'>
  <div className='plasmo-flex plasmo-flex-col plasmo-h-full plasmo-gap-3 plasmo-p-2'>
{!nextStep &&
<>
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
onClick={()=>setNextStep(true)}
className='plasmo-bg-secondary plasmo-mt-6 plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'

>Confirm</button>
</>
}

{nextStep && <>
<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
 
 <div className="plasmo-flex plasmo-gap-2 plasmo-items-center">
 <div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-full">
  <p className='plasmo-text-white'>Password</p>
  <input
  type={inputType}
onChange={(e) => {
  setPassword(e.target.value);
}}
value={password}
placeholder='Enter Password To Confirm...'
className='plasmo-bg-accent plasmo-w-full plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>
 </div>

<div onClick={()=>{
  if(inputType === 'text'){
    setInputType('password');
    return;
  }
  setInputType('text');
}} className='plasmo-text-secondary plasmo-text-2xl'>
{inputType === 'text' ? <IoEyeOff/> : <FaEye/>}  
</div>  
 </div>

</div>
<button 
onClick={handleLoadCheckOwnership}
className='plasmo-bg-secondary plasmo-self-center plasmo-w-full plasmo-mt-6 plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'

>Confirm</button>
</>}

  </div>
</Modal>
{publicAddress && ((nftElements &&  nftElements.length > 0) || importedNfts.length > 0) &&
<div className='plasmo-h-64 plasmo-w-full plasmo-overflow-y-auto'>

  {publicAddress && nftElements && nftElements.length > 0 &&
    <div className='plasmo-grid plasmo-grid-cols-3 plasmo-gap-4 '> 
    {nftElements.map((element, index)=>(<div>
      <p className='plasmo-text-secondary'>{JSON.stringify(element)}</p>
    </div>))}
  </div>
    }


    {publicAddress && importedNfts && importedNfts.length > 0 && 
     <div className='plasmo-grid plasmo-grid-cols-3 plasmo-gap-4'> 
    {importedNfts.map((element, index)=>(<div className='plasmo-w-28 plasmo-relative plasmo-top-0 plasmo-left-0 plasmo-h-28 plasmo-rounded-lg'>
      <img src={`${element.image}`} height={64} width={64} className='plasmo-w-full plasmo-rounded-lg plasmo-h-full'/>

      <div className="plasmo-absolute plasmo-p-1 plasmo-bottom-0 plasmo-left-0 plasmo-bg-accent/75 plasmo-w-full plasmo-h-6 plasmo-rounded-b-lg plasmo-line-clamp-1">
        <p className='plasmo-text-secondary plasmo-text-xs'>{element.tokenName}</p>
      </div>
    </div>))}
  </div>
    }
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
   publicAddress && nftElements && nftElements.length === 0 && importedNfts && importedNfts.length === 0 && <div className='plasmo-w-full plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-3 plasmo-py-3'>
      <p className='plasmo-text-white plasmo-text-center'>No NFTs Owned Yet</p>
      <PiFlyingSaucerFill className='plasmo-text-secondary plasmo-text-6xl'/>
      <p className='plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-text-white'>Start Exploring NFT World on <Link to={'https://opensea.io/'} target='_blank'><SiOpensea className='plasmo-text-secondary plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-2xl'/></Link></p>
      </div>}



      </>
  )
}

export default NFTsByWallet