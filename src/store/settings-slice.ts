import { NetworkType } from "@/utils/data.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TokenType = {
    name: string,
    symbol: string,
    address: string,
    decimal: number,
}

export interface settingsState {
    darkTheme: boolean,
    sfx: boolean,
    music: boolean,
    volume: number,
    fullScreen: boolean,
    network: NetworkType,
    realBank: boolean,
    token: TokenType,
}

const initialState: settingsState = {
    darkTheme: false,
    sfx: false,
    music: false,
    volume: 0,
    fullScreen: false,
    network: "none",
    realBank: false,
    token: {
        name: "",
        symbol: "",
        address: "",
        decimal: 0,
    },
}


const settingsSlice = createSlice( {
    name: "settings",
    initialState,
    reducers: {
        setupNet(state, action: PayloadAction<NetworkType>) {
            state.network = action.payload
        },
        setupToken(state) {
            state.token = {
                name: "Dollar",
                symbol: "$",
                address: "",
                decimal: 0
            }
        },
        setupRealBank(state) {
            state.realBank = false
        },
        toggleFullScreen(state) {
            state.fullScreen = !state.fullScreen
        },
    }
})

export const settingsActions = settingsSlice.actions


export default settingsSlice;