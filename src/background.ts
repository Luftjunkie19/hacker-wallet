
import {openDB} from 'idb';

export {}

console.log('Call now here');

chrome.runtime.onMessage.addListener(async(
   message, sender,sendResponse
)=>{

const dbName="web3-wallet-data";
const VER=1; const 
sessionDb= async ()=>{
    return openDB(dbName, VER, {
        upgrade(database) {
            if(!database.objectStoreNames.contains("web3-wallet-data")) database.createObjectStore('web3-wallet-data');
        },
    })
};

const db= await sessionDb();
const element = await db.get("web3-wallet-data", "currentConnectedNetwork");

console.log(element);

    console.log('Message received');
    console.log(message);
    console.log(sender);

    sendResponse({
        network:element.networkName,
        url:element.rpcURL,
        from:'Background'
    });


})
