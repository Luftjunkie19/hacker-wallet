import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState={
    encryptedWallet: null,
    address: null,
};

export const currentWalletSlice = createSlice({
name: 'loggedInWallet',
initialState,
reducers: {
    setCurrentWallet: (state, action:PayloadAction<{encryptedWallet:string, address:string}>
    ) => {
        state.encryptedWallet = action.payload.encryptedWallet;
        state.address = action.payload.address;
    },
    clearCurrentWallet: (state) => {
        state.encryptedWallet = null;
        state.address = null;
    },
},
});

export const { setCurrentWallet, clearCurrentWallet } = currentWalletSlice.actions;

export const walletReducer = currentWalletSlice.reducer;