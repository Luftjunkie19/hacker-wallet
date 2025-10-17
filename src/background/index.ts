export {}

import { fetchContainingKeywordElements, loadKey } from "~popup/IndexedDB/WalletDataStorage"

console.log('Hello from Background');

chrome.tabs.onActivated.addListener(async(activeInfo)=>{
    console.log(activeInfo);

    const loadedKeys = await fetchContainingKeywordElements();

    console.log(loadedKeys);

});




