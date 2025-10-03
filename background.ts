

export {}



chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {

    console.log('Received message from', sender.origin, ':', message)

    if (message.type === 'openHackerWallet') {
        sendResponse({ info: 'This is background info from the extension.' })
        console.log('Sent background info to', sender.origin)
        chrome.action.openPopup();
    }
})