import React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

const Bank = () => {
  const game = useSelector((state: RootState) => state.game)
  const settings = useSelector((state: RootState) => state.settings)

  const {bankCash} = game
  const {token} = settings


  return (
    <Paper sx={{
      mt: 2,
      p: 2,
      borderRadius: "12px",
    
    }}>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between"
      }}><Typography sx={{
        color: "primary.contrastText"
      }}>Bank</Typography>
      <Typography sx={{
        color: "primary.contrastText"
      }}>{token.symbol} {bankCash}</Typography></Box>
        
    </Paper>
  )
}

export default Bank