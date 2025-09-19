import {openDB} from 'idb';

const dbName="current_wallet";
const VER=1;

export const db= async ()=>{
    return openDB(dbName, VER, {
        upgrade(database) {
            if(!database.objectStoreNames.contains("current_wallets")) database.createObjectStore('current_wallets');
        },
    })
};

export const saveKey=async (key:string, value:any)=>{
    const database= await db();
    database.put('current_wallets', value, key);
}

export const loadKey= async (key:string)=>{
const database= await db();
return database.get("current_wallets", key);
}

export const deleteKey= async(key:string)=>{
    const database = await db();
    return database.delete('current_wallets', key);
}

export const fetchContainingKeywordElements= async()=>{
    const database= await db();
    const elements= await database.getAll('current_wallets');
console.log(elements);
}


