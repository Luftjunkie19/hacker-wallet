export {}

(function (){
    window.hackerWallet={
        name:"Hacker Wallet",
        id:'hackerWallet',
        request: async({method:string, params:any})=>{},
        on:(event:string, handler)=>{},
        removeListener:(event:string, handler)=>{},
        isHackerWallet:true,
    }


})();



window.addEventListener('message', (event)=>{
 
if(event.data.target === 'hackerWallet'){

    chrome.runtime.sendMessage(
        event.data
    );

}


});

