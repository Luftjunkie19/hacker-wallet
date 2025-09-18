import { configureStore } from '@reduxjs/toolkit';
import React from 'react'

import { Provider, useDispatch, useSelector, useStore } from 'react-redux';
import { walletReducer } from './slices/LoggedInWallet';

type Props = {
    children: React.ReactNode
}

export const store = configureStore({
    reducer:{
        loggedIn: walletReducer,
    }
});

function ReduxWrapper({ children }: Props) {


  return (
    <Provider store={store}>
        {children}
    </Provider>
  ) 
}

export default ReduxWrapper;

export type AppStore=typeof store;
export type RootState=ReturnType<AppStore['getState']>;
export type AppDispatch=AppStore['dispatch'];

export const useAppDispatch=useDispatch.withTypes<AppDispatch>();
export const useAppSelector=useSelector.withTypes<RootState>();
export const useAppStore=useStore.withTypes<AppStore>();