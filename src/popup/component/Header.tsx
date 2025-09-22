import { DropdownMenu } from 'radix-ui';
import React, { useState } from 'react'
import { IoGitNetworkSharp, IoLogOut } from "react-icons/io5";
import {FaClipboard, FaEthereum, FaExternalLinkAlt} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { IoMdAddCircle } from 'react-icons/io';
import { redirect } from 'react-router-dom';
import { deleteKey, fetchContainingKeywordElements } from '~popup/IndexedDB/WalletDataStorage';
import { setCurrentNetwork } from '~popup/state-managment/slices/CurrentWalletNetwork';
import Modal from './modals/Modal';
import TransferModal from './modals/TransferModal';
import { ethers } from 'ethers';
import bcrypt  from 'bcryptjs';
type Props = {}

function Header({}: Props) {
    const isLoggedIn= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const currentChain=useAppSelector((selector)=>selector.currentNetworkConnected.networkAlchemyId);
    const encryptedPrivateKey= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const encryptedPassword= useAppSelector((selector)=>selector.loggedIn.encryptedWallet);
    const rpcURL= useAppSelector((selector)=>selector.currentNetworkConnected.rpcURL);
    const dispatch=useAppDispatch();
    const [openState, setOpenState]=useState<boolean>(false);
    const [password, setPassword]=useState<string>();
    const [accountDetails, setAccountDetails]=useState<{mnemonic:string, privateKey:string}>();

    const networksArray=[
      {
    chainId:11155111,
    blockExplorerURL:'https://sepolia.etherscan.io',
    networkName:'Ethereum Sepolia',
    rpcURL:`https://eth-sepolia.g.alchemy.com/v2/${process.env.PLASMO_PUBLIC_ALCHEMY_API_KEY}`,
    currencySymbol:'SepoliaETH',
    networkAlchemyId:'sepolia-eth'
},
{
   chainId:17000,
    blockExplorerURL:'https://holesky.etherscan.io',
    networkName:'Ethereum Holesky',
    rpcURL:`https://eth-holesky.g.alchemy.com/v2/${process.env.PLASMO_PUBLIC_ALCHEMY_API_KEY}`,
    currencySymbol:'ETH',
    networkAlchemyId:'holesky-eth'
}
    ];

    const logoutFromWallet= async ()=>{
await deleteKey('session');
    }


    const handleGetAccountDetails= async ()=>{
console.log(password);

const isPasswordNotTheSame = await bcrypt.compare(password, encryptedPassword)
  if(isPasswordNotTheSame){
  alert('Password are not the same');
  return;
  }



      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedPrivateKey, password);

      console.log(wallet);

      if(wallet){
        setAccountDetails({mnemonic:((wallet as any).mnemonic).phrase, privateKey:wallet.privateKey })
      setPassword(null);
      }
    }


    return (
    <div className="plasmo-gap-24 plasmo-flex 
   plasmo-justify-between plasmo-w-full
    plasmo-items-center">
           <div
           onClick={()=>{
            redirect('/');
           }}
           className="self-center
           plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-cursor-pointer
           ">
              <img src={require('../icon.png')} width={56}height={56}className="plasmo-w-12 plasmo-h-12 plasmo-rounded-lg" alt="HackerWallet Logo" />
        <p className="plasmo-text-lg plasmo-text-center plasmo-font-bold plasmo-text-secondary">
        HackerWallet
      </p>
      </div>

      {
isLoggedIn &&
      <div className="plasmo-flex plasmo-outline-none plasmo-gap-4">

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
	<button>
    <IoGitNetworkSharp
    className='
    plasmo-text-secondary
    plasmo-text-2xl
    '
    />
</button>

	</DropdownMenu.Trigger>
	<DropdownMenu.Content className='plasmo-bg-accent plasmo-mr-16 plasmo-mt-6 plasmo-h-64 plasmo-overflow-auto plasmo-max-w-52 plasmo-w-full plasmo-flex plasmo-flex-col plasmo-gap-2
  plasmo-justify-between
  plasmo-text-white plasmo-p-3 plasmo-rounded-lg plasmo-border plasmo-border-secondary'>
	
  <div className="
  plasmo-flex plasmo-flex-col plasmo-gap-2
  ">
{networksArray.map((network)=>(
    	<DropdownMenu.Item onClick={()=>{
        dispatch(setCurrentNetwork({
          'blockExplorerURL':network.blockExplorerURL, 
          'chainId':network.chainId,
          'currencySymbol':network.currencySymbol,
          'networkAlchemyId':network.networkAlchemyId,
          'networkName':network.networkName,
          rpcURL:network.rpcURL
        }));


      }} className={`plasmo-flex plasmo-outline-none plasmo-items-center plasmo-cursor-pointer plasmo-gap-2
      plasmo-transition-all hover:plasmo-scale-95 ${network.networkAlchemyId === currentChain ? 'plasmo-bg-secondary plasmo-text-accent plasmo-p-1 plasmo-rounded-lg hover:plasmo-text-secondary hover:plasmo-bg-primary' : 'hover:plasmo-text-secondary' }`}>
               <FaEthereum />   {network.networkName}
            </DropdownMenu.Item>
))}

  </div>

		

		<DropdownMenu.Item className='plasmo-outline-none plasmo-cursor-pointer plasmo-text-white
    plasmo-flex plasmo-gap-2 plasmo-items-center hover:plasmo-text-secondary plasmo-transition-all
    hover:plasmo-scale-95
    '>
      <IoMdAddCircle
      className='
      plasmo-text-2xl
      '
      />
                 Add New Network
            </DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>



<DropdownMenu.Root>
	<DropdownMenu.Trigger>
	<button>
    <FaGear
    className='
    plasmo-text-secondary
    plasmo-text-2xl
    '
    />
</button>

	</DropdownMenu.Trigger>
	<DropdownMenu.Content className='plasmo-bg-accent plasmo-justify-between plasmo-mr-16 plasmo-mt-6 plasmo-h-64 plasmo-overflow-auto plasmo-max-w-52 plasmo-w-full plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-text-white plasmo-p-3 plasmo-rounded-lg plasmo-border plasmo-border-secondary'>
	<div className="plasmo-flex plasmo-flex-col plasmo-gap-3">
    	<DropdownMenu.Item onClick={()=>{setOpenState(true)}} className='plasmo-flex plasmo-outline-none plasmo-items-center plasmo-cursor-pointer plasmo-gap-2
     hover:plasmo-text-secondary plasmo-transition-all
    hover:plasmo-scale-95
    '>
    <RiGitRepositoryPrivateFill />    Reveal Private Key
            </DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item className='plasmo-flex plasmo-items-center plasmo-outline-none plasmo-cursor-pointer
     hover:plasmo-text-secondary plasmo-transition-all
    hover:plasmo-scale-95
    plasmo-gap-2'>
      <FaExternalLinkAlt/>
              Network's Explorer
            </DropdownMenu.Item>
  </div>


		<DropdownMenu.Item
    onClick={logoutFromWallet}
    className='plasmo-flex plasmo-outline-none plasmo-items-center plasmo-cursor-pointer plasmo-gap-2
     hover:plasmo-text-red-500 plasmo-transition-all
    hover:plasmo-scale-95
    '>
    <IoLogOut />   Logout
            </DropdownMenu.Item>
		
	</DropdownMenu.Content>
</DropdownMenu.Root>






      </div>
      }

      {openState && <TransferModal setCloseModal={()=>{
      setOpenState(false);
      setAccountDetails(null);
      setPassword(null);
      }}>
  {!accountDetails && <>
  
       <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
  <p className='plasmo-text-white'>Password</p>
  <input
onChange={(e) => {
  setPassword(e.target.value);
}}
value={password}
placeholder='Enter Password...'
className='plasmo-bg-accent plasmo-border plasmo-border-secondary plasmo-rounded-lg plasmo-p-2 plasmo-text-white'
/>
</div>


<button 
onClick={handleGetAccountDetails}
className='plasmo-bg-secondary plasmo-mt-6 plasmo-rounded-lg plasmo-p-2 plasmo-border plasmo-border-secondary plasmo-text-accent hover:plasmo-bg-accent hover:plasmo-text-secondary hover:plasmo-scale-95 plasmo-transition-all'

>Confirm</button>

  </>}

  {accountDetails && <>
<div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
  <p className='plasmo-text-secondary plasmo-text-lg plasmo-font-semibold'>Private Key:</p>
  <p className='plasmo-text-white'>{accountDetails.privateKey}</p>
  <button className='plasmo-flex plasmo-text-white plasmo-items-center plasmo-gap-2' onClick={()=>navigator.clipboard.writeText(accountDetails.privateKey)}>Copy Private Key <FaClipboard className='plasmo-text-secondary'/></button>
</div>

<div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-full">
    <p className='plasmo-text-secondary plasmo-text-lg plasmo-font-semibold'>Mnemonic:</p>
<div className="plasmo-grid plasmo-w-full plasmo-grid-cols-4 plasmo-gap-2">
 {accountDetails.mnemonic.split(" ").map((word)=>(<div className='plasmo-bg-primary plasmo-text-center plasmo-p-1 plasmo-text-sm plasmo-text-secondary plasmo-rounded-lg' id={word}>{word}</div>))}
</div>
   <button className='plasmo-flex plasmo-items-center plasmo-text-white plasmo-gap-2' onClick={()=>navigator.clipboard.writeText(accountDetails.mnemonic)}>Copy Mnemonic <FaClipboard className='plasmo-text-secondary'/></button>
</div>

  </>}
  

        </TransferModal>}
      </div>
  )
}

export default Header