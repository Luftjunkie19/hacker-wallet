export {}

(function (){
    window.hackerWallet={
        name:"Hacker Wallet",
        id:'hackerWallet',
        on:()=>{},
    }


})();



window.addEventListener('message', (event)=>{
 
if(event.data.target === 'hackerWallet'){

    chrome.runtime.sendMessage(
        event.data
    );

}


});

