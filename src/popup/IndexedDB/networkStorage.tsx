import { openDB } from "idb";

const dbName="networks";
const VER=1;

export const networkDB= async ()=>{
     return openDB(dbName, VER, {
        upgrade(database, oldVersion, newVersion, transaction, event) {
            if(!database.objectStoreNames.contains("networks")) database.createObjectStore('networks');
        },
    })
}

export const saveKey=async (key:string, value:any)=>{
    const database= await networkDB();
    database.put('networks', value, key);
}

export const loadKey= async (key:string)=>{
const database= await networkDB();
return database.get("networks", key);
}

export const deleteKey= async(key:string)=>{
    const database = await networkDB();
    return database.delete('networks', key);
}

