import React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { groupPlayerLandsInSets } from "@/utils/functions"
import PlayerLandsInSets from "./PlayerLandsInSets"


const Players = () => {
    const game = useSelector((state: RootState) => state.game)
    const settings = useSelector((state: RootState) => state.settings)
    const [showPlayerLands, setShowPlayerLands] = React.useState<number | null>(null)

    const {players, turn, lands} = game


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



    return <Paper elevation={0} sx={{
        mt: 2,
        borderRadius: "12px",
    }}>
        {players.map((player, index) => {
            return <Box key={`p${index}`}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    cursor: "pointer",
                    bgcolor: ( player.turn === turn) ?  "rgba(0,0,0,0.1)" : "",
                
                }} onClick={() => toggleShowPlayerLands(index)}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                        <Box sx={{
                            bgcolor: player.character,
                            width: "35px",
                            height: "35px",
                            borderRadius: 4,
                        }}>
                        </Box>
                        <Typography variant="body1" sx={{
                            ml: 2,
                            color: "white"
                        }}>{player.name}</Typography>
                    </Box>
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