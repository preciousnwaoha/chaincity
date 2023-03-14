import React from 'react'
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { formatTime } from '@/utils/functions'


const Logs = () => {
    const game = useSelector((state: RootState) => state.game)

    const {logs} = game


    let totalTime: number = (logs.length > 0) ? logs[logs.length - 1].timestamp - logs[0].timestamp : 0
     

  return (
    <Paper sx={{
        p: 2,
        mt: 2,
        borderRadius: "12px",
    }}>
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1,
        }}>
            <Typography>History</Typography>
            <Typography>{formatTime(totalTime)}</Typography>

        </Box>
        {logs.map((log, index) => {
            return <Box key={`log${index}`} sx={{
                display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            py: 1,
            }}>
                <Typography>{`${formatTime(logs[logs.length - 1].timestamp - logs[index].timestamp)}`}</Typography>
            <Typography>{log.message}</Typography>
            </Box>
        })}
    </Paper>
  )
}

export default Logs