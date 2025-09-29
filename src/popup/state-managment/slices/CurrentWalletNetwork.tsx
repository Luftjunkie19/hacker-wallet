import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState={
    chainId:11155111,
    blockExplorerURL:'https://sepolia.etherscan.io',
    networkName:'Ethereum Sepolia',
    rpcURL:`https://eth-sepolia.g.alchemy.com/v2/${process.env.PLASMO_PUBLIC_ALCHEMY_API_KEY}`,
    currencySymbol:'SepoliaETH',
    networkAlchemyId:'eth-sepolia'
};

export const currentConnectedNetwork = createSlice({
name: 'currentConnectedNetwork',
initialState,
reducers: {
    setCurrentNetwork: (state, action:PayloadAction<{chainId:number, currencySymbol:string, networkName:string, rpcURL:string, blockExplorerURL:string, networkAlchemyId:string}>
    ) => {
        state.chainId=action.payload.chainId;
        state.blockExplorerURL=action.payload.blockExplorerURL;
        state.currencySymbol=action.payload.currencySymbol;
        state.rpcURL=action.payload.rpcURL;
        state.networkName=action.payload.networkName;   
        state.networkAlchemyId=action.payload.networkAlchemyId;
    }
},
});

export const { setCurrentNetwork } = currentConnectedNetwork.actions;

export const networkReducer = currentConnectedNetwork.reducer;