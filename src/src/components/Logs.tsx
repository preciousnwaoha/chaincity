import React from 'react'
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { convertLogsTimestamp, formatTime } from '@/utils/functions'


const Logs = () => {
    const game = useSelector((state: RootState) => state.game)

    const {logs} = game

    console.log({logs})

    // const sortedLogs = logs.sort((a, b) => a.timestamp - b.timestamp)

    // console.log(sortedLogs)

    let totalTime: number = (logs.length > 0) ? logs[logs.length - 1].timestamp - logs[0].timestamp : 0

    const formatedLogs = convertLogsTimestamp(logs).sort((a, b) => b.timestamp - a.timestamp)

     

  return (
    <Paper sx={{
        p: 2,
        // mt: 2,
        borderRadius: "12px",
        width: "100%",
      height: "100%",
      maxHeight: {xs: "auto", md: "200px"},
      overflow: "hidden"
      
        }}>
            <Box sx={{
                height: "100%",
                overflowY: "auto",
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


        {formatedLogs.map((log, index) => {
            return <Box key={`log${index}`} sx={{
                display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            py: 1,
            }}>
                <Typography>{`${formatTime(log.timestamp)}`}</Typography>
            <Typography>{log.message}</Typography>
            </Box>
        })}
            </Box>
       
    </Paper>
  )
}

export default Logs