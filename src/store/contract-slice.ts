import { createSlice, PayloadAction  } from "@reduxjs/toolkit";
import { ethers } from "ethers";


type contractType = ethers.Contract | undefined
export interface contractState {
    currentAccount: string,
    accounts: string[],
    balance: number,
    provider: ethers.providers.Web3Provider | undefined
    signer: ethers.providers.JsonRpcSigner | undefined
    tokenContract: contractType
    tokenBalance: 0,
}


const initialState: contractState = {
    currentAccount: "",
    accounts: [],
    balance: 0,
    provider: undefined,
    signer: undefined,
    tokenContract: undefined,
    tokenBalance: 0,
}


const contractSlice = createSlice( {
    name: "contract",
    initialState,
    reducers: {
        stageContract(state, action: PayloadAction<{tokenContract: any,  provider: ethers.providers.Web3Provider}>) {
            state.tokenContract = action.payload.tokenContract
            state.provider = action.payload.provider
        },
        stageAccount(state, action) {
            state.signer = action.payload.signer
            state.currentAccount = action.payload.account
            state.accounts = action.payload.accounts
            state.balance = action.payload.balance
            state.tokenBalance = action.payload.tokenBalance
        }

    },
    
})

export const contractActions = contractSlice.actions


export default contractSlice;