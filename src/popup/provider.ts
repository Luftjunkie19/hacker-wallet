import { ethers } from "ethers";
import { loadKey } from "./IndexedDB/WalletDataStorage";

const currentNetwork = await loadKey('currentNetwork');

const provider = new ethers.JsonRpcProvider(currentNetwork.rpcURL);

export {provider}