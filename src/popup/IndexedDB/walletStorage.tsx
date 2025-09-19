import {openDB} from 'idb';

const dbName="current_wallet";
const VER=1;

export const db= async ()=>{
    return openDB(dbName, VER, {
        upgrade(database, oldVersion, newVersion, transaction, event) {
            if(!database.objectStoreNames.contains("current_wallet")) database.createObjectStore('current_wallet');
        },
    })
};

export const saveKey=async (key:string, value:any)=>{
    const database= await db();
    database.put('current_wallet', value, key);
}

export const loadKey= async (key:string)=>{
const database= await db();
return database.get("current_wallet", key);
}

export const deleteKey= async(key:string)=>{
    const database = await db();
    return database.delete('current_wallet', key);
}


