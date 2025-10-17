import type {PlasmoCSConfig} from 'plasmo';
import {sendToBackground} from '@plasmohq/messaging';

export const config:PlasmoCSConfig={
    matches:['<all_urls>'],
    world:"MAIN",
};

(function(){
  window.hackerWallet = {
    isHackerWallet: true,
    async request({ method, 
        payload
     }){
    try {
      const handlerRequest = await sendToBackground(
{'name':'conveyer', 
  extensionId:'cnlaimnmamfapmfkepefbemobinoaobf', 
  body:{
    from:'hackerWallet-connector',
method,
payload
}
});     

console.log(handlerRequest, 'handler Request');
      
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
