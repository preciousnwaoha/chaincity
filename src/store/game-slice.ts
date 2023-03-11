import { LandInterface, LandSetInterface, LogInterface, PlayerInterface } from "@/utils/data.types";
import { getLandFromID } from "@/utils/functions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



export interface GameState {
    playing: boolean,
    lands: LandInterface[],
    gameStepSequence: string[],
    landSets: LandSetInterface[],
    players: PlayerInterface[],
    startingCash: number,
    logs: LogInterface[],
    bankCash: number,
    bankLands: string[]
    bankHoldings: string[],
    turn: number,
}

const initialState: GameState = {
    playing: false,
    lands: [],
    landSets: [],
    gameStepSequence: [],
    players: [],
    startingCash: 0,
    logs: [],
    bankCash: 0, 
    bankLands: [],
    bankHoldings: [],
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
            state.landSets = action.payload.landSets
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
            // ...
        },
        mortgage(state, action: PayloadAction<{player: number, landID: string}>) {
            let updatedPlayers = [...state.players]
            let updatedLands = [...state.lands]
            let land = updatedLands.filter(land => land.id === action.payload.landID)[0]

            let playerObj = updatedPlayers[action.payload.player]

            playerObj.cash += land.price * land.mortgageFactor
            state.bankCash -=  land.price * land.mortgageFactor
            state.bankHoldings.push(action.payload.landID)
            
            // remove land from player
            let newPlayerLands = playerObj.lands.filter(land => land !== action.payload.landID)
            playerObj.lands = newPlayerLands

            // ret land "mortgaged" prop to true
            land.mortgaged = true

            // update state.lands
            let indexOfLand = updatedLands.indexOf(land)
            updatedLands =  updatedLands.filter(land => land.id !== action.payload.landID)
            let u = updatedLands.slice(0, indexOfLand)
            let v = updatedLands.slice(indexOfLand)
            updatedLands = [...u, land, ...v]
            state.lands = updatedLands

            // update state.players
            updatedPlayers = updatedPlayers.filter((_, index) => index !== action.payload.player)
            let a = updatedPlayers.slice(0, action.payload.player)
            let b = updatedPlayers.slice(action.payload.player)
            updatedPlayers = [...a, playerObj, ...b]
            state.players = updatedPlayers
        },
        unmortgage(state, action: PayloadAction<{player: number, landID: string}>) {
            let updatedPlayers = [...state.players]
            let updatedLands = [...state.lands]

            let land = updatedLands.filter(land => land.id === action.payload.landID)[0]
            let playerObj = updatedPlayers[action.payload.player]

            playerObj.cash -= land.price * land.mortgageFactor
            state.bankCash +=  land.price * land.mortgageFactor

            // remove land from bank
            state.bankHoldings = state.bankHoldings.filter(holding => holding !== action.payload.landID)
            
            // add land to player
            playerObj.lands.push(action.payload.landID)

            // set land "mortgaged" prop to false
            land.mortgaged = false

            // update state.lands
            let indexOfLand = updatedLands.indexOf(land)
            updatedLands =  updatedLands.filter(land => land.id !== action.payload.landID)
            let u = updatedLands.slice(0, indexOfLand)
            let v = updatedLands.slice(indexOfLand)
            updatedLands = [...u, land, ...v]
            state.lands = updatedLands

            // update state.players
            updatedPlayers = updatedPlayers.filter((_, index) => index !== action.payload.player)
            let a = updatedPlayers.slice(0, action.payload.player)
            let b = updatedPlayers.slice(action.payload.player)
            updatedPlayers = [...a, playerObj, ...b]
            state.players = updatedPlayers
        },
        trade(state, action: PayloadAction<{
            from: number,
            to: number,
            cashFrom: number,
            cashTo: number,
            landIDsFrom: string[],
            landIDsTo: string[]
        }>) {
            let updatedLands = [...state.lands]
            let updatedPlayers = [...state.players]

            // let landsFrom = action.payload.landIDsFrom.map(id => getLandFromID(id, updatedLands))
            // let landsTo = action.payload.landIDsTo.map(id => getLandFromID(id, updatedLands))
            let playerFromObj = updatedPlayers[action.payload.from]
            let playerToObj = updatedPlayers[action.payload.to]

            // remove sendings lands from trader
            playerFromObj.lands = playerFromObj.lands.filter(id => !action.payload.landIDsFrom.includes(id))
            // add recieving lands to trader
            playerFromObj.lands.concat(action.payload.landIDsTo)
            

            // remove sendings lands from trader
            playerToObj.lands = playerToObj.lands.filter(id => !action.payload.landIDsTo.includes(id))
            // add recieving lands to trader
            playerToObj.lands.concat(action.payload.landIDsFrom)

            // update lands
            updatedLands = updatedLands.map(land => {
                let sendFromTo = (land.owner === playerFromObj.address) && action.payload.landIDsFrom.includes(land.id)
                let sendToFrom = (land.owner === playerToObj.address) && action.payload.landIDsTo.includes(land.id)
                if (sendFromTo) {
                    return {
                        ...land,
                        owner: playerToObj.address
                    }
                } else if (sendToFrom) {
                    return {
                        ...land,
                        owner: playerFromObj.address
                    }
                }
                else {
                    return land
                }
            })

            state.lands = updatedLands


        }
    }
})

export const gameActions = gameSlice.actions


export default gameSlice;