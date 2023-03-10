import Box from '@mui/material/Box'
import React, {useCallback, useEffect} from 'react'
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from '@mui/material/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { getLandFromID } from '@/utils/functions'
import Deed from './Deed'
import { gameActions } from '@/store/game-slice'
import { LandInterface } from '@/utils/data.types'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface PayingRentProps {
    open: boolean,
    land: LandInterface,
    player: number,
}

const PayingRent = ({open, land, player} : PayingRentProps) => {

 
  

  return (
        <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Paper>
          <Box>
            Paying Rent
          </Box>
        
        
    </Paper>
        </Box>
      </Modal>
  )
}

export default PayingRent