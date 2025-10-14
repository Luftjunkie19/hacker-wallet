export {}


const pendingArr = new Map();
const listeners = new Map();

const emitEvent = (event, payload)=>{
    const s = listeners.get(event);

    if(s){
        for (const func of s) {
            try{
                func(payload);
            }catch(err){
                console.log(err)
            }
        }
    }
}

window.hackerWallet={
        name:"Hacker Wallet",
        selectedAddress: undefined,
        id:'hackerWallet',
        request: async({method, payload}:{method:string, payload?:any})=>{
        const id= crypto.randomUUID();

        return new Promise((resolve, reject)=>{
            pendingArr.set(id, {resolve, reject});
            window.postMessage({hackerWallet:true, id, type:'request', method, payload},"*");
        });

        },
        on:(event:"accountsChanged" | "chainChanged" | "connect" | "disconnect" | "message", handler)=>{

            if(!listeners.has(event)) listeners.set(event, new Set())
                
                listeners.get(event).add(handler);
                return ()=> this.removeListener(event, handler);
            
        },
        removeListener:(event:string, handler:(payload:any)=>void)=>{
            listeners.get(event)?.delete(handler);
        },
        connect:async()=>{
            return this.request({method:'eth_requestAccounts'});
        },
        getChainId: async()=>{
            return this.request({method:'eth_chainId'});
        },
        isHackerWallet:true
    }




// window.addEventListener('message', (e)=>{
//     const messageData = e.data;

//     chrome.runtime.sendMessage({...messageData, origin:window.origin
//     });
// });


chrome.runtime.onMessage.addListener((event)=>{
 
    const messageData=event.data;

    console.log('hackerWallet', messageData);


    if(!messageData.hackerWallet) return;

    if(messageData.type === 'response'){
    
        console.log(messageData);
        
    
    }



});


