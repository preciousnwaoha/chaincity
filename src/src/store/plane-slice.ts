import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface planeState {
    magnification: number,
    divisions: number,
}

const initialState = {
    magnification: 1,
    divisions: 25,
}


const planeSlice = createSlice( {
    name: "plane",
    initialState,
    reducers: {
        increaseMag(state) {
            state.magnification = state.magnification + 0.1
        },
    }
})

export const planeActions = planeSlice.actions


export default planeSlice;