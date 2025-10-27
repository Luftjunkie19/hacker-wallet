import { relayMessage } from '@plasmohq/messaging';
import type {PlasmoCSConfig} from 'plasmo';

export const config:PlasmoCSConfig={
    matches:['<all_urls>'],
    world:"MAIN",
};


(function(){
    (window as any).hackerWallet = {
    isHackerWallet: true,
    async request({ method, 
        payload
     }){
    try {

      console.log(method, payload);
  

    } catch (error) {
      console.log(error);
    }
    },
    on(event, handler){

    },
    removeListener(event, handler){
      
    }
  };
})();



