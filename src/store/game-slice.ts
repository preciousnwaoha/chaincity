import { createSlice } from "@reduxjs/toolkit";


const gameSlice = createSlice( {
    name: "game",
    initialState: {
        playing: false
    },
    reducers: {
        togglePlaying(state) {
            state.playing = !state.playing
        }
    }
})

export const gameActions = gameSlice.actions


export default gameSlice;