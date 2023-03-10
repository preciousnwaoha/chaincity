import { LandInterface, LogInterface, PlayerInterface } from "@/utils/data.types";
import { getLandFromID } from "@/utils/functions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



export interface GameState {
    playing: boolean,
    lands: LandInterface[],
    gameStepSequence: string[],
    players: PlayerInterface[],
    startingCash: number,
    logs: LogInterface[],
    bankCash: number,
    turn: number,
}

const initialState: GameState = {
    playing: false,
    lands: [],
    gameStepSequence: [],
    players: [],
    startingCash: 0,
    logs: [],
    bankCash: 0, 
    turn: 0,
}

const gameSlice = createSlice( {
    name: "game",
    initialState,
    reducers: {
        setup(state, action: PayloadAction<GameState>) {
            state.playing = action.payload.playing
            state.lands = action.payload.lands
            state.players = action.payload.players
            state.gameStepSequence = action.payload.gameStepSequence
            state.startingCash = action.payload.startingCash
            state.logs = action.payload.logs
            state.bankCash = action.payload.bankCash
            state.turn = action.payload.turn
        },
        togglePlaying(state) {
            state.playing = !state.playing
        },
        setStartingCash(state, action: PayloadAction<number>) {
            state.startingCash = action.payload
        },
        log(state, action: PayloadAction<LogInterface>) {
            state.logs.push(action.payload)
        },
        addPlayer(state, action: PayloadAction<PlayerInterface>){
            state.players.push(action.payload)
        },
        setBankCash() {

        },
        nextTurn (state) {
            if (state.turn === (state.players.length - 1)) {
                state.turn = 0
            } else {
                state.turn = state.turn + 1
            }
        },
        moveTo(state, action: PayloadAction<{player: number, landID: string}>) {
            let updatedPlayers = [...state.players]

            let land = state.lands.filter(land => land.id === action.payload.landID)[0]

            let playerObj = updatedPlayers[action.payload.player]
            let playersWithoutPlayer = updatedPlayers.filter((_, index) => index !== action.payload.player)

            /**
             * MOVE LOGIC
             */
            // move player
            playerObj.position = action.payload.landID

            // FIX PLAYER INTO PLAYERS ARRAY
            let a = playersWithoutPlayer.slice(0, action.payload.player)
            let b = playersWithoutPlayer.slice(action.payload.player)

            updatedPlayers = [...a, playerObj, ...b]

            /**
             * RENT LOGIC
             */
            let hasOwner = !!land.owner
            let playerIsOwner = land.owner === playerObj.address
            
            if (hasOwner && !playerIsOwner) {
                let ownerPlayerObj = updatedPlayers.filter(player => land.owner === player.address)[0]
                let ownerPlayer = updatedPlayers.indexOf(ownerPlayerObj)

                let playersWithoutOwnerPlayer = updatedPlayers.filter((_, index) => (index !== ownerPlayer))
                console.log({ownerPlayerObj, ownerPlayer})

                // pay rent
                playerObj.cash -= land.rent
                ownerPlayerObj.cash += land.rent

                // FIX OWNER PLAYER INTO PLAYERS ARRAY
                let x = playersWithoutOwnerPlayer.slice(0, ownerPlayer)
                let y = playersWithoutOwnerPlayer.slice(ownerPlayer)

                updatedPlayers = [...x, ownerPlayerObj, ...y]
            }
        

            state.players = updatedPlayers;
            
        },
        buyLand(state, action: PayloadAction<{player: number, landID: string}> ){
            let land = state.lands.filter(land => land.id === action.payload.landID)[0]



            let playerObj = state.players[action.payload.player]
            playerObj.cash -= land.price
            state.bankCash += land.price
            playerObj.lands.push(action.payload.landID)
           

            let playersWithoutPlayer = state.players.filter((_, index) => index !== action.payload.player)
            
            let a = playersWithoutPlayer.slice(0, action.payload.player)
            let b = playersWithoutPlayer.slice(action.payload.player)

            state.players = [...a, playerObj, ...b]


            let updatedLands = state.lands.map((land, index)=>{
                if ( land.id === action.payload.landID) {
                    console.log(land.id)
                    return {
                        ...land,
                        owner: playerObj.address
                    }
                }

                return land
            })

            state.lands = updatedLands

        },
        payRent(state, action: PayloadAction<{player: number, landID: string}>) {
            let land = state.lands.filter(land => land.id === action.payload.landID)[0]

            let playerObj = state.players[action.payload.player]
            console.log({player: action.payload.player, playerObj, players: state.players})
            playerObj.cash -= land.rent

            let playerThatOwnsLand = state.players.filter(player => land.owner === player.address)[0]
            let indexOfPlayerThatOwnsLand = state.players.indexOf(playerThatOwnsLand)
            console.log({playerThatOwnsLand, indexOfPlayerThatOwnsLand})
            playerThatOwnsLand.cash += land.rent



            let playersRemoved = state.players.filter((_, index) => (index !== action.payload.player) && (index !== indexOfPlayerThatOwnsLand))
            
            let newPlayers = []
            let a = playersRemoved.slice(0, indexOfPlayerThatOwnsLand)
            let b = playersRemoved.slice(indexOfPlayerThatOwnsLand)

            newPlayers = [...a, playerThatOwnsLand, ...b]

            let x = newPlayers.slice(0, action.payload.player)
            let y = newPlayers.slice(action.payload.player)

            newPlayers = [...x, playerObj, ...y]

            console.log(newPlayers)
            state.players = newPlayers;

        }
    }
})

export const gameActions = gameSlice.actions


export default gameSlice;