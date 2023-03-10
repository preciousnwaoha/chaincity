import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TokenType = {
    name: string,
    symbol: string,
    address: string,
    decimal: string,
}

export interface settingsState {
    darkTheme: boolean,
    sfx: boolean,
    music: boolean,
    volume: number,
    fullScreen: boolean,
    mainnet: boolean,
    realBank: boolean,
    token: TokenType,
}

const initialState = {
    darkTheme: false,
    sfx: false,
    music: false,
    volume: 0,
    fullScreen: false,
    mainnet: false,
    realBank: false,
    token: {
        name: "",
        symbol: "",
        address: "",
        decimal: "",
    },
}


const settingsSlice = createSlice( {
    name: "settings",
    initialState,
    reducers: {
        toggleFullScreen(state) {
            state.fullScreen = !state.fullScreen
        },
    }
})

export const settingsActions = settingsSlice.actions


export default settingsSlice;