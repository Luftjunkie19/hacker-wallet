
export {}

console.log('Call now here');


chrome.runtime.onMessage.addListener(async(
   message, sender,sendResponse
)=>{
try {

if(message.type === "request"){

     const messageSent = await chrome.runtime.sendMessage({ hackerWallet:true, from:'background', type:'pending', id:message.id, origin: message.origin, payload: message });

    chrome.action.openPopup();

    console.log('Message sent to popup', messageSent);      
}


if(message.type === 'response' && message.from === 'hackerWallet-popup'){
    const sentMessage =
  await chrome.runtime.sendMessage({...message, hackerWallet:true,
    to: 'hacker-walletContent'
  });

  console.log(sentMessage);
}



} catch (error) {
    console.log(error, 'Background error'); 
    
}
});
