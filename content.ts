// page-inject.js (runs in page context)
(function() {

  if ((window as any).hackerWallet) return;
  const listeners = {};

  function sendToExt(msg) {
    window.postMessage({ direction: 'to-extension', message: msg }, '*');
  }

  const provider = {
    isHackerWallet: true,
    request: (payload) => new Promise((resolve, reject) => {
      const id = Math.random().toString(36).slice(2);
      function responseHandler(e) {
        if (!e.data || e.data.direction !== 'from-extension' || e.data.message.id !== id) return;
        window.removeEventListener('message', responseHandler);
        const { error, result } = e.data.message;
        if (error) reject(error); else resolve(result);
      }
      window.addEventListener('message', responseHandler);
      sendToExt({ id, type: 'request', payload });
    }),
    on: (event, fn) => { (listeners[event] = listeners[event] || []).push(fn); },
    removeListener: (event, fn) => { listeners[event] = (listeners[event]||[]).filter(f=>f!==fn); },
    _emit: (event, data) => { (listeners[event]||[]).forEach(fn => { try{ fn(data); }catch(e){} }); }
  };

  // receive events/responses from content script
  window.addEventListener('message', (e) => {
    if (!e.data || e.data.direction !== 'from-page-script') return;
    const { event, data } = e.data;
    if (event && provider._emit) provider._emit(event, data);
  });

  (window as any).hackerWallet = (window as any).ethereum = provider;
})();


// content-script.js (runs in extension context)
window.addEventListener('message', (e) => {
  if (!e.data || e.data.direction !== 'to-extension') return;
  const msg = e.data.message;
  chrome.runtime.sendMessage(msg, (resp) => {
    window.postMessage({ direction: 'from-extension', message: resp }, '*');
  });
});

// also forward extension-initiated events to page
chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
  // msg { type: 'event', event: 'accountsChanged', data: [...] }
  window.postMessage({ direction: 'from-page-script', event: msg.event, data: msg.data }, '*');
});