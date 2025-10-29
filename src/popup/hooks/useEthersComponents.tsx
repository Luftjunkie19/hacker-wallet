import bcrypt from 'bcryptjs';
import { ethers } from 'ethers';
import { useAppSelector } from '~popup/state-managment/ReduxWrapper';


function useEthersComponents() {
    const rpcURL = useAppSelector((state)=>state.currentNetworkConnected.rpcURL);
  const encryptedPrivatKey= useAppSelector((state)=>state.loggedIn.encryptedWallet);
    const passwordOfSession = useAppSelector((state)=>state.loggedIn.password);
 const provider = new ethers.JsonRpcProvider(rpcURL);

 const getWallet = async (passwordToEncrypt: string) => {
const wallet = await ethers.Wallet.fromEncryptedJson(encryptedPrivatKey, passwordToEncrypt);
          try{
            const walletDecrypted = new ethers.Wallet(wallet.privateKey, provider);

            if(!walletDecrypted){
                throw new Error("Failed to decrypt wallet with the provided password.");
            }

          return walletDecrypted;
          }
            catch(err){
                throw new Error("Failed to decrypt wallet with the provided password.");
            }
 }

 const checkValidity = async (passwordToEncrypt: string) => {
try {
    const isValid= await bcrypt.compare(passwordToEncrypt, passwordOfSession);
              
              if(!passwordOfSession || !isValid){
                alert('Wrong password to validate the transaction !');
              throw new Error("Wrong password to validate the transaction !");
              }

} catch (error) {
    throw new Error("Wrong password to validate the transaction !");
}
    

 }


 return {provider, getWallet, checkValidity};
}

export default useEthersComponents