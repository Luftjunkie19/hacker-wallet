import type {PlasmoCSConfig} from 'plasmo';

export const config:PlasmoCSConfig={
    matches:['<all_urls>'],
    world:"MAIN",
};

console.log('Hello');

(function(){
    (window as any).hackerWallet = {
    isHackerWallet: true,
    async request({ method, 
        payload
     }){
    try {

  await chrome.runtime.sendMessage({
      payload,
      method,
      isHackerWallet:true
    });
  

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


