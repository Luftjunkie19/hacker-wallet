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
import ImportedNFT from './elements/NftElements/Home/ImportedNFT';
import NoNFTs from './elements/NftElements/Home/NoNFTs';
import LoadYourNFTModal from './elements/NftElements/Home/LoadYourNFTModal';
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
<LoadYourNFTModal nextStep={nextStep} setTokenAddress={setTokenAddress} tokenAddress={tokenAddress} 
setTokenId={setTokenId} setNextStep={setNextStep} password={password} setPassword={setPassword} 
inputType={inputType} setInputType={setInputType} handleLoadCheckOwnership={handleLoadCheckOwnership}

/>
{publicAddress && ((nftElements &&  nftElements.length > 0) || importedNfts.length > 0) &&
<div className='plasmo-h-64 plasmo-w-full plasmo-overflow-y-auto plasmo-grid plasmo-grid-cols-3 plasmo-gap-4'>

  {publicAddress && nftElements && nftElements.length > 0 &&
    <> 
    {nftElements.map((element, index)=>(<div>
      <p className='plasmo-text-secondary'>{JSON.stringify(element)}</p>
    </div>))}
  </>
    }


    {publicAddress && importedNfts && importedNfts.length > 0 && 
     <> 
    {importedNfts.map((element, index)=>(<ImportedNFT index={index} element={element}/>))}
  </>
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
   publicAddress && nftElements && nftElements.length === 0 && importedNfts && importedNfts.length === 0 && 
   <NoNFTs/>
   }



      </>
  )
}

export default NFTsByWallet