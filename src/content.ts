export {}

(function (){
    window.hackerWallet={
        name:"Hacker Wallet",
        id:'hackerWallet',
        on:()=>{},
    }


})();



window.addEventListener('message', (event)=>{
 
if(event.data.target === 'hacker-wallet'){

    chrome.runtime.sendMessage(
        event.data
    );

}

if(event.data.from && event.data.from === 'Background'){
    console.log(event.data);
}


});

