export {}

import type { PlasmoMessaging } from "@plasmohq/messaging";
import { fetchContainingKeywordElements, loadKey } from "~popup/IndexedDB/WalletDataStorage";

const handler: PlasmoMessaging.MessageHandler= async (req, res)=>{
    try{
    
        console.log(req.body, req.extensionId, req.name);

        if(req.body.method === 'eth_requestAccounts'){
            const loadedElements= await fetchContainingKeywordElements();
            const keyStoreElements = loadedElements.filter((item)=>item.address && !item.expiresAt);
            const loadedNetworkObj = await loadKey('currentConnectedNetwork');
            res.send({
                accounts:keyStoreElements,
                chainId: loadedNetworkObj.chainId
            });
            return;
        }

        if(req.body.method === 'eth_getAccounts'){
             const loadedElements= await fetchContainingKeywordElements();
             const keyStoreElements = loadedElements.filter((item)=>item.address && !item.expiresAt);
             res.send(keyStoreElements.map((item)=>item.address));
             return;
        }



    }catch(err){

        res.send(err);

        console.log(err);
    }
}


export default handler