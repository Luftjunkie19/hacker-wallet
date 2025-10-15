export {}

const pending = new Map();
const listeners = new Map(); // event -> Set<fn>

function emitEvent(event, payload){
  const s = listeners.get(event);
  if (s) for (const fn of s) try { fn(payload) } catch(e){}
}
(function(){
  window.hackerWallet = {
    isHackerWallet: true,
    request({ method, params }){
      const id = crypto.randomUUID();
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        window.postMessage({ hackerWallet: true, id, type: "request", method, params }, "*");
      });
    },
    connect(){ return this.request({ method: "eth_requestAccounts" }); },
    getChainId(){ return this.request({ method: "eth_chainId" }); },
    on(event, handler){
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(handler);
      return () => this.removeListener(event, handler);
    },
    removeListener(event, handler){
      listeners.get(event)?.delete(handler);
    }
  };

  window.addEventListener("message", (e) => {
    const d = e.data;
    if (!d?.hackerWallet) return;
    if (d.type === "response" && pending.has(d.id)){
      const { resolve, reject } = pending.get(d.id);
      pending.delete(d.id);
      d.error ? reject(d.error) : resolve(d.result);
    }
    if (d.type === "event") {
      emitEvent(d.event, d.payload);
    }
  });
})();