export {}

(function (){

const pending = new Map();
const listeners = new Map();


    window.hackerWallet={
        name:"Hacker Wallet",
        selectedAddress: undefined,
        id:'hackerWallet',
        request: async({method:string, params:any})=>{},
        on:(event:"accountsChanged" | "chainChanged" | "connect" | "disconnect" | "message", handler)=>{},
        removeListener:(event:string, handler:(payload:any)=>void)=>{},
        connect:async()=>{},
        getChainId: async()=>{},
        isHackerWallet:true,
        isConnected:()=>{}
    }


})();



window.addEventListener('message', (event)=>{
 
if(event.data.target === 'hackerWallet'){

    chrome.runtime.sendMessage(
        {
            ...event.data,
            origin: event.origin
        }
    );

}


});

