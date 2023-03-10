import {configureStore } from "@reduxjs/toolkit"
import gameSlice from "./game-slice"
import settingsSlice from "./settings-slice"
import planeSlice from "./plane-slice";

const store = configureStore({
    reducer: { 
        game: gameSlice.reducer,
        plane: planeSlice.reducer,
        settings: settingsSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;

export default store;