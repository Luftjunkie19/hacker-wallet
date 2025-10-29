import type { PlasmoMessaging } from "@plasmohq/messaging"
import { loadKey } from "~popup/IndexedDB/WalletDataStorage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {

    try {
        if (req.body.method === 'getChainId') {
            const network = await loadKey('currentConnectedNetwork');

            if(network){
                res.send({
                    type: 'response',
                    method: 'getChainId',
                    response: {
                        chainId: network.chainId,
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