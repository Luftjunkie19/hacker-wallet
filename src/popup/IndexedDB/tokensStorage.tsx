import {openDB} from 'idb';

const dbName="current_wallet";
const VER=1;

export const erc20Db= async ()=>{
    return openDB(dbName, VER, {
        upgrade(database) {
            if(!database.objectStoreNames.contains("erc20s_owned")) database.createObjectStore('erc20s_owned');
        },
    })
};

export const saveErc20Token=async (key:string, value:any)=>{
    const database= await erc20Db();
    database.put('erc20s_owned', value, key);
}

export const loadErc20Token= async (key:string)=>{
const database= await erc20Db();
return database.get("erc20s_owned", key);
}

export const deleteErc20Token= async(key:string)=>{
    const database = await erc20Db();
    return database.delete('erc20s_owned', key);
}

export const fetchErc20Tokens= async()=>{
    const database= await erc20Db();
    const elements= await database.getAll('erc20s_owned');
console.log(elements);
}


export const erc721Db= async ()=>{
    return openDB(dbName, VER, {
        upgrade(database) {
            if(!database.objectStoreNames.contains("erc721s_owned")) database.createObjectStore('erc721s_owned');
        },
    })
}

export const saveErc721Token=async (key:string, value:any)=>{
    try{
        const database= await erc721Db();
       await database.put('erc721s_owned', value, key);

    }catch(err){
        console.log(err);
    }
}

export const loadErc721Token= async (key:string)=>{
    const database= await erc721Db();
    return database.get("erc721s_owned", key);
}

export const deleteErc721Token= async(key:string)=>{
    const database= await erc721Db();
    return database.delete('erc721s_owned', key);
}

export const fetchErc721Tokens= async()=>{
    const database= await erc721Db();
    const elements= await database.getAll('erc721s_owned');
    console.log(elements);
}
