import type {PlasmoCSConfig} from 'plasmo';

export const config:PlasmoCSConfig={
    matches:['<all_urls>'],
    world:"MAIN",
}

const pending = new Map();
const listeners = new Map(); 

function emitEvent(event, payload){
  const s = listeners.get(event);
  if (s) for (const fn of s) try { 
    fn(payload);
  } catch(e){}
}

(function(){
  window.hackerWallet = {
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
    connect(){ },
    getChainId(){  },
    on(event, handler){

    },
    removeListener(event, handler){
      
    }
  };

})();


