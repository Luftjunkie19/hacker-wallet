import {openDB} from 'idb';

const dbName="current_wallet";
const VER=1;

export const 
sessionDb= async ()=>{
    return openDB(dbName, VER, {
        upgrade(database) {
            if(!database.objectStoreNames.contains("session")) database.createObjectStore('session');
        },
    })
};

export const saveKey=async (key:string, value:any)=>{
    const database= await sessionDb();
    database.put('session', value, key);
}

export const loadKey= async (key:string)=>{
const database= await sessionDb();
return database.get("session", key);
}

export const deleteKey= async(key:string)=>{
    const database = await sessionDb();
    return database.delete('session', key);
}

export const fetchContainingKeywordElements= async()=>{
    const database= await sessionDb();
    const elements= await database.getAll('session');
console.log(elements);
}

