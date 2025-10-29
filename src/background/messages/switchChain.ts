import type { PlasmoMessaging } from "@plasmohq/messaging"
import { networksArray } from "~chains";
import { loadKey, saveKey } from "~popup/IndexedDB/WalletDataStorage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {

    try {
        if (req.body.method === 'wallet_switchEthereumChain') {

            const networkObject= networksArray.find((network)=>network.chainId===Number(req.body.chainId));

            if(!networkObject){
                res.send({
                    type: 'error',
                    message: `Network with chainId ${req.body.chainId} not found.`
                });
                return;
            }
             await saveKey('currentConnectedNetwork', networkObject);

            if(networkObject){
                res.send({
                    type: 'response',
                    method: 'wallet_switchEthereumChain',
                    response: {
                        networkObject,
                    }
                });
            }

        }
    
    }
    catch (error) {
        console.error('Error in getChainId handler:', error);
        res.send({
            type: 'error',
            message: 'An error occurred while fetching the chain ID.'
        });
    }


}

export default handler