import { createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { ethers } from "ethers";


type contractType = ethers.Contract | undefined
export interface contractState {
    currentAccount: string,
    accounts: string[],
    balance: number,
    provider: ethers.providers.Web3Provider | undefined
    signer: ethers.providers.JsonRpcSigner | undefined
    tokenContract: contractType,
    gameContract: contractType,
    tokenBalance: number,
}


const initialState: contractState = {
    currentAccount: "",
    accounts: [],
    balance: 0,
    provider: undefined,
    signer: undefined,
    tokenContract: undefined,
    gameContract: undefined,
    tokenBalance: 0,
}


const contractSlice = createSlice( {
    name: "contract",
    initialState,
    reducers: {
        stageContract(state, action: PayloadAction<{tokenContract: any, gameContract: any,  provider: ethers.providers.Web3Provider}>) {
            state.tokenContract = action.payload.tokenContract
            state.provider = action.payload.provider
            state.gameContract = action.payload.gameContract
        },
        stageAccount(state, action: PayloadAction<{
            signer: ethers.providers.JsonRpcSigner,
            currentAccount: string,
            accounts: string[],
            balance: number,
            tokenBalance: number,
        }>) {
            state.signer = action.payload.signer
            state.currentAccount = action.payload.currentAccount
            state.accounts = action.payload.accounts
            state.balance = action.payload.balance
            state.tokenBalance = action.payload.tokenBalance
        }

    },
    
})

export const contractActions = contractSlice.actions


export default contractSlice;