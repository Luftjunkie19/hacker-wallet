export const networksArray=[
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