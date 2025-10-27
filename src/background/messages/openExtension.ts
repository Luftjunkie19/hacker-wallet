import { type PlasmoMessaging } from "@plasmohq/messaging";
import { deleteKey, fetchContainingKeywordElements, loadKey, saveKey } from "../../popup/IndexedDB/WalletDataStorage";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    try {

        if(req.body.type === 'request'){
            chrome.windows.create({
                height: 576,
                width: 384,
                url: chrome.runtime.getURL('popup.html'),
                top: 50,
                left: 50,
                type: 'popup',
                tabId: req.tabId,
                focused: true,
            }, async (window) => {
                try {
                    const elementsFetched = await fetchContainingKeywordElements();
                    const keystoredWallets = elementsFetched.filter((item) => !item.loggedAt && item.address && item.encryptedWallet && item.password);
                    console.log(keystoredWallets, 'Elements');

                    console.log('Popup got opened up.', window);

                await saveKey('external_request', {
                        ...req.body,
                        type: 'request',
                        method: 'eth_requestAccounts'
                    });

                    if (keystoredWallets.length === 0) {
                        await chrome.windows.remove(window.id);
                        res.send({ 
                            type: 'response',
                            method: 'eth_requestAccounts',
                            response: {
                                addresses: null,
                                error: 'You have no key-wallets available.',
                            }
                        });
                        return;
                    }

                    setTimeout(async ()=>{
                        try {
                            const requestResponse = await loadKey('request_reponse');
                            let response = requestResponse;
                            if (!requestResponse) {
                                await chrome.windows.remove(window.id);
                                res.send({
                                    type: 'response',
                                    method: 'eth_requestAccounts',
                                    response: {
                                        addresses: null,
                                        error: 'No response from popup.',
                                    }
                                });
                                return;
                            }
                            await deleteKey('external_request');
                            await deleteKey('request_reponse');
                            await chrome.windows.remove(window.id);
                            res.send(response);
                        } catch (error) {
                            console.error("Error fetching request response:", error);
                            await chrome.windows.remove(window.id);
                            res.send({
                                type: 'error',
                                message: 'An error occurred while fetching the response.'
                            });
                        }
                    },2500);


                } catch (err) {
                    console.error("Error in popup logic:", err);
                    res.send({
                        type: 'error',
                        message: 'An error occurred while fetching wallet data.'
                    });
                }
            });
        }
    } catch (error) {
        console.error("An error occurred in the handler:", error);
        res.send({ 
            type: 'error',
            message: 'An unexpected error occurred.'
        });
    }
};

export default handler;
