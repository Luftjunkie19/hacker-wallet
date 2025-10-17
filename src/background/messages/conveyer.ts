export {}

import type { PlasmoMessaging } from "@plasmohq/messaging";
import { fetchContainingKeywordElements, loadKey, saveKey } from "~popup/IndexedDB/WalletDataStorage";

const handler: PlasmoMessaging.MessageHandler= async (req, res)=>{
    try{
        
        if(req.body.method === 'eth_requestAccounts'){
            await saveKey('request_data', {...req});
           await chrome.windows.create({
            'height':576, 
            width:384, 
            'type':'popup',
            'focused':true,
            'url':'chrome-extension://cnlaimnmamfapmfkepefbemobinoaobf/popup.html'
        });

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

        if(req.body.method === 'eth_isAuthorized'){
                 const loadedSessionObj = await loadKey('session');
                 if(loadedSessionObj){
                    res.send(true);
                    return
                 }

                 res.send(false);
        }


    }catch(err){

        res.send(err);

        console.log(err);
    }
}


export default handler