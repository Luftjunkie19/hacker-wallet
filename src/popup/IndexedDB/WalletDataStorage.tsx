import {openDB} from 'idb';

const dbName="web3-wallet-data";
const VER=1;

export const 
sessionDb= async ()=>{
    return openDB(dbName, VER, {
        upgrade(database) {
            if(!database.objectStoreNames.contains("web3-wallet-data")) database.createObjectStore('web3-wallet-data');
        },
    })
};

export const saveKey=async (key:string, value:any)=>{
    const database= await sessionDb();
    database.put('web3-wallet-data', value, key);
}



export const loadKey= async (key:string)=>{
const database= await sessionDb();
return database.get("web3-wallet-data", key);
}

export const deleteKey= async(key:string)=>{
    const database = await sessionDb();
    return database.delete('web3-wallet-data', key);
}

export const fetchContainingKeywordElements= async()=>{
    const database= await sessionDb();
    const elements= await database.getAll('web3-wallet-data');
return elements;
}

