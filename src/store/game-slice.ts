import { LandInterface, LandSetInterface, LogInterface, PlayerInterface, TradeInterface } from "@/utils/data.types";
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

            let playerObj = updatedPlayers[action.payload.player]
            let playersWithoutPlayer = updatedPlayers.filter((_, index) => index !== action.payload.player)

            /**
             * MOVE LOGIC
             */
            // move player
            playerObj.position = action.payload.landID
            playerObj.pendingRent = true

            // FIX PLAYER INTO PLAYERS ARRAY
            let a = playersWithoutPlayer.slice(0, action.payload.player)
            let b = playersWithoutPlayer.slice(action.payload.player)

            updatedPlayers = [...a, playerObj, ...b]

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
            let updatedPlayers = [...state.players]

            let land = state.lands.filter(land => land.id === action.payload.landID)[0]

            let playerObj = updatedPlayers[action.payload.player]

            /**
             * RENT LOGIC
             */
            let hasOwner = !!land.owner
            let playerIsOwner = land.owner === playerObj.address
            playerObj.pendingRent = false
            
            if (hasOwner && !playerIsOwner) {
                let ownerPlayerObj = updatedPlayers.filter(player => land.owner === player.address)[0]
                let ownerPlayer = updatedPlayers.indexOf(ownerPlayerObj)

                

                // pay rent
                playerObj.cash -= land.rent
                ownerPlayerObj.cash += land.rent

                // fix player into players array
                updatedPlayers = updatedPlayers.filter((_, index) => (index !== action.payload.player))
                let a = updatedPlayers.slice(0, action.payload.player)
                let b = updatedPlayers.slice( action.payload.player)
                updatedPlayers = [...a, playerObj, ...b]

                // fix owner into players array
                updatedPlayers = updatedPlayers.filter((_, index) => (index !== ownerPlayer))
                let x = updatedPlayers.slice(0, ownerPlayer)
                let y = updatedPlayers.slice(ownerPlayer)
                updatedPlayers = [...x, ownerPlayerObj, ...y]
            }
        

            state.players = updatedPlayers;
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
        acceptTrade(state, action: PayloadAction<{player: number, trader: number}>) {
            let updatedLands = [...state.lands]
            let updatedPlayers = [...state.players]

            let playerObj = updatedPlayers[action.payload.player]
            let traderObj = updatedPlayers[action.payload.trader]

            const trade: TradeInterface = playerObj.trades.filter(trade => ((trade.from === action.payload.trader) && (trade.to === action.payload.player)))[0]
            const { from, to, cashFrom, cashTo, landIDsFrom, landIDsTo} = trade

            console.log(trade)
        

            // TRADE LANDS
            // remove lands from trader
            traderObj.lands = traderObj.lands.filter(id => !landIDsFrom.includes(id))
            // add removed trader lands to player-
            playerObj.lands = [...playerObj.lands, ...landIDsFrom]

            console.log("playerObj.lands", playerObj.lands)
            
            // remove lands from player
            playerObj.lands = playerObj.lands.filter(id => !landIDsTo.includes(id))
            // add player lands to trader
            traderObj.lands = [...traderObj.lands, ...landIDsTo]
            console.log("traderObj.lands", traderObj.lands)

            // TRADE CASH
            playerObj.cash += (cashFrom - cashTo)
            traderObj.cash += (cashTo - cashFrom)

            // REMOVE TRADE
            // remove trade from trader
            traderObj.trades = traderObj.trades.filter(trade => !((trade.from === action.payload.trader) && (trade.to === action.payload.player)))
            // remove trade from player
            playerObj.trades = traderObj.trades.filter(trade => !((trade.from === action.payload.trader) && (trade.to === action.payload.player)))

            // UPDATE PLAYERS STATE
            // update players with trader
            updatedPlayers = updatedPlayers.filter((_, index) => index !== from)
            let a = updatedPlayers.slice(0, from)
            let b = updatedPlayers.slice(from)
            updatedPlayers = [...a, traderObj, ...b]
            // update players with player
            updatedPlayers = updatedPlayers.filter((_, index) => index !== to)
            let x = updatedPlayers.slice(0, to)
            let y = updatedPlayers.slice(to)
            updatedPlayers = [...x, playerObj, ...y]

            
            state.players = updatedPlayers

            // update lands
            updatedLands = updatedLands.map(land => {
                let sendFromTo = (land.owner === playerObj.address) && landIDsTo.includes(land.id)
                let sendToFrom = (land.owner === traderObj.address) && landIDsFrom.includes(land.id)
                if (sendFromTo) {
                    return {
                        ...land,
                        owner: traderObj.address
                    }
                } else if (sendToFrom) {
                    return {
                        ...land,
                        owner: playerObj.address
                    }
                }
                else {
                    return land
                }
            })
            state.lands = updatedLands



        },
        placeTrade(state, action: PayloadAction<TradeInterface>) {
            let updatedPlayers = [...state.players]

            let traderObj = updatedPlayers[action.payload.from]
            let tradeeObj = updatedPlayers[action.payload.to]

            traderObj.trades.push(action.payload)
            tradeeObj.trades.push(action.payload)

             // update players with trader
             updatedPlayers = updatedPlayers.filter((_, index) => index !== action.payload.from)
             let a = updatedPlayers.slice(0, action.payload.from)
             let b = updatedPlayers.slice(action.payload.from)
             updatedPlayers = [...a, traderObj, ...b]
 
             // update players with tradee
             updatedPlayers = updatedPlayers.filter((_, index) => index !== action.payload.to)
             let x = updatedPlayers.slice(0, action.payload.to)
             let y = updatedPlayers.slice(action.payload.to)
             updatedPlayers = [...x, tradeeObj, ...y]
 
             state.players = updatedPlayers


        },
        rejectTrade(state, action: PayloadAction<{player: number, trader: number}>) {
            let updatedPlayers = [...state.players]

            let playerObj = updatedPlayers[action.payload.player]
            let traderObj = updatedPlayers[action.payload.trader]

            // TRADER SENDS
            // remove trade from trader
            traderObj.trades = traderObj.trades.filter(trade => !((trade.from === action.payload.trader) && (trade.to === action.payload.player)))
            // remove trade from player
            playerObj.trades = traderObj.trades.filter(trade => !((trade.from === action.payload.trader) && (trade.to === action.payload.player)))
            

            // update players with trader
            updatedPlayers = updatedPlayers.filter((_, index) => index !== action.payload.trader)
            let a = updatedPlayers.slice(0, action.payload.trader)
            let b = updatedPlayers.slice(action.payload.trader)
            updatedPlayers = [...a, traderObj, ...b]

            // update players with player
            updatedPlayers = updatedPlayers.filter((_, index) => index !== action.payload.player)
            let x = updatedPlayers.slice(0, action.payload.player)
            let y = updatedPlayers.slice(action.payload.player)
            updatedPlayers = [...x, playerObj, ...y]

            state.players = updatedPlayers

        },
        bankrupt(state, action: PayloadAction<{player: number, bankrupter: number}>) {
                let updatedPlayers = [...state.players]
                let updatedLands = [...state.lands]

                let playerObj = updatedPlayers[action.payload.player]
                

                let isByPlayer = action.payload.bankrupter < updatedPlayers.length

                if (isByPlayer) {
                    // bankrupted by player
                    let bankrupterObj = updatedPlayers[action.payload.bankrupter]
                    bankrupterObj.cash += playerObj.cash
                    playerObj.cash = 0
                    bankrupterObj.lands = [...bankrupterObj.lands, ...playerObj.lands]
                    playerObj.lands = []
                    
                    updatedLands = updatedLands.map(land => {
                        return {
                            ...land,
                            owner: bankrupterObj.address
                        }
                    })

                    updatedPlayers = updatedPlayers.filter((_, index) => index !== action.payload.player)
                    let x = updatedPlayers.slice(0, action.payload.player)
                    let y = updatedPlayers.slice(action.payload.player)
                    updatedPlayers = [...x, playerObj, ...y]

                    updatedPlayers = updatedPlayers.filter((_, index) => index !== action.payload.bankrupter)
                    let a = updatedPlayers.slice(0, action.payload.player)
                    let b = updatedPlayers.slice(action.payload.player)
                    updatedPlayers = [...a, bankrupterObj, ...b]

                } else {
                    // bankrupted by bank
                    state.bankCash += playerObj.cash
                    playerObj.cash = 0
                    state.bankLands = [...state.bankLands, ...playerObj.lands]
                    playerObj.lands = []

                    updatedLands = updatedLands.map(land => {
                        return {
                            ...land,
                            owner: ""
                        }
                    })

                    updatedPlayers = updatedPlayers.filter((_, index) => index !== action.payload.player)
                    let x = updatedPlayers.slice(0, action.payload.player)
                    let y = updatedPlayers.slice(action.payload.player)
                    updatedPlayers = [...x, playerObj, ...y]

                }

                
                state.players = updatedPlayers
                state.lands = updatedLands

        }
    }
})

export const gameActions = gameSlice.actions


export default gameSlice;