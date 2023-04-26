import React, {useEffect} from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useSelector, useDispatch } from "react-redux"
import { gameActions } from '@/store/game-slice'
import { RootState } from "@/store"
import { groupPlayerLandsInSets, getLandFromID } from "@/utils/functions"
import PlayerLandsInSets from "./PlayerLandsInSets"

import {io} from "socket.io-client";

const socket = io('http://localhost:3001');

const Players = () => {
    const dispatch = useDispatch()
    const contract = useSelector((state: RootState) => state.contract)
    const game = useSelector((state: RootState) => state.game)
    const settings = useSelector((state: RootState) => state.settings)
    const [showPlayerLands, setShowPlayerLands] = React.useState<number | null>(null)

    const {players, turn, lands, roomId} = game
    const {currentAccount} = contract


    const landsGroupedInSets = groupPlayerLandsInSets(players[turn].lands, lands)

    const {token} = settings
    let tokenSymbol = token ? token.symbol : "--"

    const toggleShowPlayerLands = (index: number) => {
        
        setShowPlayerLands(prev => {
            if (index === prev) {
                return null
            }
            return index
        })
    }

    const client = players.filter(player => player.address === currentAccount)[0]

    const {position: landID} = client

    const land = getLandFromID(landID, lands)

    const handleBankrupt = () => {
        
        let landOwnerIndex = players.length

      for (let i = 0; i < players.length; i++) {
        if (players[i].address === land.owner) {
          landOwnerIndex = i
        }
      }

      const stateData = {player: turn, bankrupter: landOwnerIndex}
      socket.emit('bankrupt', {roomId, stateData})
      dispatch(gameActions.bankrupt(stateData))
    }


    useEffect(() => {
        socket.emit('rejoin', {roomId})

        socket.on('bankrupt', ({ roomId, stateData}: {roomId: string, stateData: {
            player: number, bankrupter: number,
          } }) => {
            console.log('bankrupt')
            dispatch(gameActions.bankrupt(stateData))
          })
    })



    return <Paper elevation={0} sx={{
        // mt: 2,
        borderRadius: "12px",
        width: "100%",
      height: "100%",
    //   maxHeight: "400px",
    //   overflowY: "auto",
      }}>
        {players.map((player, index) => {
            return <Box key={`p${index}`} sx={{
                bgcolor: ( player.turn === turn) ?  "rgba(0,0,0,0.1)" : "",
                
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    cursor: "pointer",
                    
                }} onClick={() => toggleShowPlayerLands(index)}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                        <Box sx={{
                            bgcolor: player.character,
                            width: "30px",
                            height: "30px",
                            borderRadius: 4,
                        }}>
                        </Box>
                        <Typography variant="body1" sx={{
                            ml: 2,
                            color: "white"
                        }}>{player.name}</Typography>
                    </Box>
                    {(player.address === currentAccount) && <Box onClick={handleBankrupt}>BANKRUPT</Box>}
                    <Typography variant="body1" sx={{
                        color: "white",
                    }}>{tokenSymbol}{player.cash}</Typography>
                </Box>
                {(( player.turn === turn) || (showPlayerLands === index ) )&& <PlayerLandsInSets player={index}
                />}
            </Box>
        })}
    </Paper>
}

export default Players