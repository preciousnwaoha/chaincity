import React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { PLAYERS_DUM } from "@/utils/dummy-data"

const Players = () => {
    let currency = "$"


    return <Paper>
        {PLAYERS_DUM.map((player, index) => {
            return <Box key={`p${index}`}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                        <Box sx={{
                            bgcolor: "rgb(204, 255, 186)",
                            width: "35px",
                            height: "35px",
                            borderRadius: 4,
                        }}>
                        </Box>
                        <Typography variant="body1" sx={{
                            ml: 2
                        }}>{player.name}</Typography>
                    </Box>
                    <Typography variant="body1">{currency}{player.cash}</Typography>
                </Box>
            </Box>
        })}
    </Paper>
}

export default Players