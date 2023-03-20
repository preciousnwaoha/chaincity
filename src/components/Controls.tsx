import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

const Controls = () => {
  return (
    <Box sx={{
        p: 2,
        width: "100%",
      height: "100%",
      border: "1px solid red"
    }}>
        <Typography variant="body1" sx={{
            textTransform: "uppercase",
        }}>Chaincity</Typography>
    </Box>
  )
}

export default Controls