import React from 'react'
import Box from "@mui/material/Box"

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "500px",
    maxWidth: "90%",
    bgcolor: 'primary.main',
    borderRadius: "12px",
    // boxShadow: 24,
    p: 2,
  };

interface GamePopupInterface {
    open: boolean;
    children: React.ReactNode
}

const GamePopup = ({open, children}: GamePopupInterface) => {
  return (
    <>
    {open && <Box sx={style}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        {children}
    </Box>}
    </>
    
  )
}

export default GamePopup