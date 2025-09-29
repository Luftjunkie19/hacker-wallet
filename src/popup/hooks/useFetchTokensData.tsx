import  { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';



function useFetchTokensData() {
    const publicAddress=useAppSelector((state)=>state.loggedIn.address);
    const alchemyNetworkId= useAppSelector((state)=>state.currentNetworkConnected.networkAlchemyId);
      const [tokens, setElements]=useState<any[]>([]);
      const [isLoading, setIsLoading]=useState<boolean>();
 
const fetchTokensCoins= useCallback(async ()=>{
              if(!publicAddress && !alchemyNetworkId){
                return;
              }

              setIsLoading(true);
        
                const url =`https://api.g.alchemy.com/data/v1/${process.env.PLASMO_PUBLIC_ALCHEMY_API_KEY}/assets/tokens/by-address`;

        const options = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: `{"addresses":[{"address":"${publicAddress}","networks":["${alchemyNetworkId}"]}]}`
        };
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          console.log(data);
          setElements(data.data.tokens);
        } catch (error) {
          console.error(error);
          setElements([]);
        }finally{
            setIsLoading(false);
        }
            },[]);
        
            useEffect(()=>{
              fetchTokensCoins();
            },[fetchTokensCoins])


            return {tokens, isLoading};


}

export default useFetchTokensData