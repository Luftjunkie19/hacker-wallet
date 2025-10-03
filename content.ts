export {};

import { provider } from "~popup/provider";

console.log('Injecting Ethereum provider into page');

console.log(provider, 'background provider');

(function() {
  if ((window as any).ethereum){
    const myProvider = { ...(window as any).ethereum, isMyWallet: true };
const existing = (window as any).ethereum;
if (existing && existing.providers) {
  // filter out duplicates of your id then put yours first
  const others = existing.providers.filter(p => !p.isMyWallet);
  (window as any).ethereum = Object.assign(myProvider, { providers: [myProvider, ...others] });
} else {
  (window as any).ethereum = myProvider;
}
  };
  const callbacks = new Map();

  function sendMessage(payload) {
    window.postMessage({ target: 'myWallet', payload }, '*');
  }

  (window as any).ethereum = {
    isMyWallet: true,
    selectedAddress: null,
    isMetamask: false,
    chainId: null,
    request({ method, params }) {
      const id = Math.random().toString(36).slice(2);
      return new Promise((resolve, reject) => {
        callbacks.set(id, { resolve, reject });
        sendMessage({ id, method, params });
        // optional timeout
        setTimeout(() => {
          if (callbacks.has(id)) {
            callbacks.get(id).reject(new Error('timeout'));
            callbacks.delete(id);
          }
        }, 60000);
      });
    },
    on(event, handler) {
      window.addEventListener('mywallet:' + event, handler);
    },
    removeListener(event, handler) {
      window.removeEventListener('mywallet:' + event, handler);
    },
    async eth_requestAccounts(){
      const accounts = await this.request({ method: 'eth_requestAccounts', params: [] });
      this.selectedAddress = accounts[0] || null;
      return accounts;
    },
    async eth_chainId(){
      const chainId = await this.request({ method: 'eth_chainId', params: [] });
      this.chainId = chainId;
      return chainId;
    },
    async eth_accounts(){
      const accounts = await this.request({ method: 'eth_accounts', params: [] });
      this.selectedAddress = accounts[0] || null;
      return accounts;
    },
  async wallet_switchEthereumChain({ chainId }){
      const result = await this.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
      this.chainId = chainId;
      return result;
  },
  async eth_sendTransaction(tx){
      return this.request({ method: 'eth_sendTransaction', params: [tx] });
  },
  async personal_sign(params){
      return this.request({ method: 'personal_sign', params });
  },
  async eth_signTypedData_v4(params){
      return this.request({ method: 'eth_signTypedData_v4', params });
  },
  async eth_requestPermissions(params){
      return this.request({ method: 'eth_requestPermissions', params });
  },
  eth_call(params){
      return this.request({ method: 'eth_call', params });
  },
  eth_getBalance(params){
      return this.request({ method: 'eth_getBalance', params });
  },
  eth_getTransactionCount(params){
      return this.request({ method: 'eth_getTransactionCount', params });
  },
  eth_estimateGas(params){
      return this.request({ method: 'eth_estimateGas', params });
  },
  eth_gasPrice(){
      return this.request({ method: 'eth_gasPrice', params: [] });
  },
  eth_getBlockByNumber(params){
      return this.request({ method: 'eth_getBlockByNumber', params });
  },
  eth_getTransactionByHash(params){
      return this.request({ method: 'eth_getTransactionByHash', params });
  },
  eth_getTransactionReceipt(params){
      return this.request({ method: 'eth_getTransactionReceipt', params });
  },
}

  window.addEventListener('message', (ev) => {
    if (!ev.data || ev.data.source !== 'myWallet-page') return;
    const { id, result, error, event } = ev.data;
    if (id) {
      const cb = callbacks.get(id);
      if (!cb) return;
      if (error) cb.reject(new Error(error));
      else cb.resolve(result);
      callbacks.delete(id);
    } else if (event) {
      window.dispatchEvent(new CustomEvent('mywallet:' + event.name, { detail: event.data }));
    }
  });
})();
