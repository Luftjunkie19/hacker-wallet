
# HackerWallet

A Web-browser Extension with a basic cryptocurrencies-wallet on Ethereum Chains. Enabled to connect with Dapps. With Hackerish look.
#
![Logo](https://i.postimg.cc/nz2s19yk/icon.png)


## Creator

- [@Luftjunkie](https://www.github.com/Luftjunkie19)


## Installation

If you want to checkout how HackerWallet works, you can download it onto your machine with following commands

```bash
  pnpm install hacker-wallet
  cd hacker-wallet
  pnpm i
```

Now as you have the project fully loaded, you can either have a production version or development version to upload onto your browser.

If you want to fully use HackerWallet you need to create an `.env` file and implement following things there:

- Alchemy API-Key
- Etherscan API-Key

```bash
PLASMO_PUBLIC_ALCHEMY_API_KEY=
PLASMO_PUBLIC_ETHERSCAN_API_KEY=
PLASMO_PUBLIC_ETHERSCAN_API_URL= https://api.etherscan.io/api

```

```bash
pnpm run dev // Builds the development version
```

```bash
pnpm run build // Builds the production version
```


## Usage of Hacker-Wallet


- Run one of the above mentioned commands to build the compiled version of HackerWallet

- Enable Developer Mode in the Extension Management in your web-browser

- Click Load Unpacked

- Find `hacker-wallet` folder

- Click `build` folder

If you have run the `pnpm run dev`, there should be a folder with dev in name, select it and click the button to finish the action and close the poup.



#### Congrats you became a f*cking hacker !
## 🚀 Connector for your Dapp

In case you would like to enable connection with HackerWallet in your Dapp, you would need to go through following steps.

Because of complications that occured while building the feature, HackerWallet requires to carry out the communication via a `@plasmo/messaging` package. Thus you first need to install it:

If you use pnpm in your Dapp, run:
```bash
pnpm i @plasmo/messaging
```

For npm users:
```bash
npm i @plasmo/messaging
```

More information on `@plasmo/messaging` and what plasmo is can be found in this link: https://docs.plasmo.com/framework/messaging

### Connector Code 

Here's the code you would have to implement into your code in order to implement in order to set-up the connector. Create a file in a special folder for non-building-blocks components like `/lib` and create a file there `HackerWalletConnector.ts`:

```typescript
import {createConnector} from "@wagmi/core";
import { ConnectParameters } from "@wagmi/core";
import { Chain } from "@wagmi/core/chains";
import {sendToBackgroundViaRelay} from '@plasmohq/messaging';


export const customConnector =createConnector((config)=>{
    return {
        'id':'hackerWallet',
        name:'Hacker Wallet',
        icon:'https://i.postimg.cc/nz2s19yk/icon.png',
        'type':'injected',
        connect: async (parameters?: ConnectParameters) => {
            try {
                const locallyStoredAddresses = localStorage.getItem('crypto_addresses');
                
                console.log(locallyStoredAddresses);

                if(locallyStoredAddresses){
                    const elementsConverted = JSON.parse(locallyStoredAddresses);

                    console.log(elementsConverted);

                    config.emitter.emit('connect', {'accounts':elementsConverted, chainId:1});
         
 
     return {
        'accounts':elementsConverted,
        'chainId':1
     };
                }

                const requestId= crypto.randomUUID();
                
                const windowOpened = await sendToBackgroundViaRelay({
                    name:'openExtension' as never,
                    body:{
                  method:'getAccounts',
                  type:'request', 
                  chainId:parameters?.chainId,
                  requestId,              
                    },
                    extensionId: '[EXTENSIONID]'  
                });


                console.log(windowOpened, 'Window Opened elements');

                if (windowOpened.response.error) {
                    throw new Error(windowOpened.response.error);
                }
                

                localStorage.setItem('crypto_addresses', JSON.stringify(windowOpened.response.addresses));
                


      config.emitter.emit('connect', {'accounts':windowOpened.addresses, chainId:1});
         
 
     return {
        'accounts':windowOpened.response.addresses,
        'chainId':1
     };
  

                
            } catch (error) {
                console.log(error);
                config.emitter.emit('error',{
                    'error' : new Error(' Could not have connected wallet with the Dapp, sorry.')
                });

                
            }

          },        
'disconnect':async ()=>{
try {
    localStorage.removeItem('crypto_addresses');
    await (window as any).hackerWallet.request({
        method:"wallet_disconnect"  
    });
} catch (error) {
    config.emitter.emit('disconnect');
}
},
'getAccounts': async () => {
const locallyStoredAddresses = localStorage.getItem('crypto_addresses');
const parsedAddresses= JSON.parse(locallyStoredAddresses);

return parsedAddresses ?? undefined;

},
'getChainId':async ()=>{
// Not implemented yet
},
'isAuthorized': async ()=>{
const locallyStoredAddresses = localStorage.getItem('crypto_addresses');
const parsedAddresses= JSON.parse(locallyStoredAddresses);

return parsedAddresses && parsedAddresses.length > 0 ? true : false;
   
},
'switchChain': async (parameters) => {
// Not implemented yet.
},
'onConnect':(connectInfo)=>{
    console.log(connectInfo, 'Connection Info');
    //Not implemented yet
},
'onDisconnect':(error)=>{
 //Not implemented yet
 config.emitter.on('disconnect',({uid})=>{})
},
'onChainChanged':(chainId)=>{
     //Not implemented yet

     config.emitter.on('change',(data)=>{
        data.chainId
     })
},
'onAccountsChanged':()=>{
     //Not implemented yet
},
'onMessage':(message)=>{
    //Not implemented yet
},
'getProvider':async(parameters)=>{
    console.log(parameters);
    return (window as any).hackerWallet
}
}
});

```


As you have that, you can import it into your Wagmi config like this:
```typescript
'use client'; // If you use Next.js

import { createConfig, http, injected } from '@wagmi/core'
import { holesky, mainnet, sepolia } from '@wagmi/core/chains' // Chains that HackerWallet supports
import { customConnector } from '[...path]/HackerWalletConnector.ts';


export const config = createConfig({
  chains: [mainnet, sepolia, holesky],
  connectors: [customConnector],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [holesky.id]: http(),
  },
})
```
## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)

