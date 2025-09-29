import { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';



function useFetchNftData(){
  const currentChain=useAppSelector((state)=>state.currentNetworkConnected.networkAlchemyId);
  const publicAddress=useAppSelector((state)=>state.loggedIn.address);
  const[elements, setElements]=useState<any[]>();
  const [isLoading, setIsLoading]=useState<boolean>();
  
    const fetchNFTELements= useCallback(async ()=>{
setIsLoading(true);
      if(!publicAddress){
        return;
      }

const url = `https://api.g.alchemy.com/data/v1/${process.env.PLASMO_PUBLIC_ALCHEMY_API_KEY}/assets/nfts/by-address`;
    
const options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: `{"addresses":[{"address":"${publicAddress}","networks":["${currentChain}"]}]}`
};
try {
  const response = await fetch(url, options);
  const data = await response.json();

  if(data.data.ownedNfts){
    setElements(data.data.ownedNfts);
  }

} catch (error) {
  console.error(error);
  setElements([]);
}finally{
  setIsLoading(false);
}
    },[]);
    

    useEffect(()=>{
      fetchNFTELements();
    },[fetchNFTELements]);


    return {elements, isLoading}


}

export default useFetchNftData