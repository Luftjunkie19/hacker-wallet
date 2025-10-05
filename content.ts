export {};

declare global {
  interface HackerWindow extends Window {
    hackerWallet?: { hacker: string; wallet?: string };
  }
}

chrome.tabs.onActivated.addListener(
async(activeInfo)=>{
await loadWindowExtension(activeInfo.tabId);

console.log(
    activeInfo.tabId,
    activeInfo.windowId
);
    
})

const loadWindowExtension=
async (tabId:number)=>{
    chrome.scripting.executeScript(
  {
    target: {
      tabId // the tab you want to inject into
    },
    world: "MAIN", // MAIN to access the window object
    func: ()=>{
       if(window){
           (window as HackerWindow).hackerWallet= {'hacker':'wallet'}
       }
    } // function to inject
  },
  () => {
    console.log("Background script got callback after injection")
  }
);
}


