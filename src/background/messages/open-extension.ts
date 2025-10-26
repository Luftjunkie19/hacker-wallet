import { relayMessage, type PlasmoMessaging } from "@plasmohq/messaging"
import { deleteKey, fetchContainingKeywordElements, loadKey, saveKey } from "../../popup/IndexedDB/WalletDataStorage";

let responseOfRequestAccounts:{addresses: `0x${string}`[] | null, error:string | null};

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {

    const requestReponse = await loadKey('extension_requestResponse');
    const windowId = await loadKey('windowId');

    if(requestReponse && windowId){

        let storedMessage = requestReponse;
        await deleteKey('extension_requestResponse');
        await deleteKey('external_request');
        await deleteKey('windowId');
        
        if(windowId){
            await chrome.windows.remove(windowId);
        }

        console.log(storedMessage, 'storedMessage');
        res.send(storedMessage);
    }

    if(req.body.method === "eth_requestAccounts" && req.body.type === 'response'){
        console.log(req);
        await saveKey('extension_requestResponse', req.body.response)

        const currentWindow =await chrome.windows.getCurrent();

        console.log(currentWindow);

        res.send(true);
    }

    

    if(req.body.type === 'request'){
        chrome.windows.create({
            height:576,
            width:384,
            url:chrome.runtime.getURL('popup.html'),
            top:0,
            left:0,
            type:'popup',
            tabId: req.tabId,
            'focused':true,
        }, async(window)=>{
        try {

    const elementsFetched = await fetchContainingKeywordElements();

            const keystoredWallets = elementsFetched.filter((item)=>!item.loggedAt && item.address && item.encryptedWallet && item.password);
console.log(keystoredWallets, 'Elements');
            if(keystoredWallets.length === 0){
await chrome.windows.remove(window.id);
throw new Error('No wallets available to connect with');
            }
      
                console.log('Popup got opened up.', window);
                if(req.body.method === 'getAccounts'){
                    await saveKey('external_request', {
                        ...req.body,
                        type:'request',
                        method:'eth_requestAccounts'
                    });
                }
                await saveKey('windowId', window.id);
                
           
            }
        catch(err){
            res.send({ 
...err,
type:'error'
            });
        }});
        }

        
    }
 
export default handler