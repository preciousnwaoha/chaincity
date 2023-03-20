import {configureStore } from "@reduxjs/toolkit"
import gameSlice from "./game-slice"
import settingsSlice from "./settings-slice"
import planeSlice from "./plane-slice";
import contractSlice from "./contract-slice";

const store = configureStore({
    reducer: { 
        game: gameSlice.reducer,
        contract: contractSlice.reducer,
        plane: planeSlice.reducer,
        settings: settingsSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>;

export default store;