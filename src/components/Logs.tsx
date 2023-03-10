import React from 'react'
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useSelector } from 'react-redux'
import { RootState } from '@/store'


const Logs = () => {
    const game = useSelector((state: RootState) => state.game)

    const {logs} = game

  return (
    <Paper sx={{
        p: 1
    }}>
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1,
        }}>
            <Typography>History</Typography>
            <Typography>00:00:12</Typography>

        </Box>
        {logs.map((log, index) => {
            return <Box key={`log${index}`} sx={{
                display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            p: 0.5
            }}>
                <Typography>{`${log.timestamp}`}</Typography>
            <Typography>{log.message}</Typography>
            </Box>
        })}
    </Paper>
  )
}

export default Logs