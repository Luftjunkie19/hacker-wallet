import { DropdownMenu } from 'radix-ui';
import React from 'react'
import { FaEthereum } from 'react-icons/fa6';
import { IoMdAddCircle } from 'react-icons/io';
import { IoGitNetworkSharp } from 'react-icons/io5';
import { saveKey } from '~popup/IndexedDB/WalletDataStorage';
import { useAppDispatch, useAppSelector } from '~popup/state-managment/ReduxWrapper';
import { setCurrentNetwork } from '~popup/state-managment/slices/CurrentWalletNetwork';

type Props = {}

function NetworksDropDown({}: Props) {

    const currentChain=useAppSelector((selector)=>selector.currentNetworkConnected.networkAlchemyId);
    const dispatch=useAppDispatch();
    const networksArray=[
      {
        chainId:1,
        blockExplorerURL:'https://etherscan.io',
        networkName:'Ethereum (Mainnet',
        rpcURL:`https://eth-mainnet.g.alchemy.com/v2/${process.env.PLASMO_PUBLIC_ALCHEMY_API_KEY}`,
        currencySymbol:'ETH',
        networkAlchemyId:'eth-mainnet',

      },
      {
    chainId:11155111,
    blockExplorerURL:'https://sepolia.etherscan.io',
    networkName:'Ethereum Sepolia',
    rpcURL:`https://eth-sepolia.g.alchemy.com/v2/${process.env.PLASMO_PUBLIC_ALCHEMY_API_KEY}`,
    currencySymbol:'SepoliaETH',
    networkAlchemyId:'eth-sepolia'
},
{
   chainId:17000,
    blockExplorerURL:'https://holesky.etherscan.io',
    networkName:'Ethereum Holesky',
    rpcURL:`https://eth-holesky.g.alchemy.com/v2/${process.env.PLASMO_PUBLIC_ALCHEMY_API_KEY}`,
    currencySymbol:'HoleskyETH',
    networkAlchemyId:'eth-holesky'
}
    ];

  return (
<DropdownMenu.Root>
    <DropdownMenu.Trigger>

    <IoGitNetworkSharp
    className='
    plasmo-text-secondary
    plasmo-text-2xl
    '
    />


    </DropdownMenu.Trigger>
    <DropdownMenu.Content className='plasmo-bg-accent plasmo-mr-16 plasmo-mt-6 plasmo-h-64 plasmo-overflow-auto plasmo-max-w-52 plasmo-w-full plasmo-flex plasmo-flex-col plasmo-gap-2
  plasmo-justify-between
  plasmo-text-white plasmo-p-3 plasmo-rounded-lg plasmo-border plasmo-border-secondary'>
    
  <div className="
  plasmo-flex plasmo-flex-col plasmo-gap-2
  ">
{networksArray.map((network)=>(
        <DropdownMenu.Item key={network.chainId} onClick={async ()=>{

          await saveKey('currentConnectedNetwork', {...network})

        dispatch(setCurrentNetwork({
       ...network
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
  )
}

export default NetworksDropDown