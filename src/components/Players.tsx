import React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useSelector } from "react-redux"
import { RootState } from "@/store"


const Players = () => {
    const game = useSelector((state: RootState) => state.game)
    const settings = useSelector((state: RootState) => state.settings)

    const {players, turn} = game

    const {token} = settings
    let tokenSymbol = token ? token.symbol : "--"



    return <Paper>
        {players.map((player, index) => {
            return <Box key={`p${index}`}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                    bgcolor: ( player.turn === turn) ?  "rgba(0,0,0,0.1)" : "",
                }}>
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
                            ml: 2
                        }}>{player.name}</Typography>
                    </Box>
                    <Typography variant="body1">{tokenSymbol}{player.cash}</Typography>
                </Box>
            </Box>
        })}
    </Paper>
}

export default Players