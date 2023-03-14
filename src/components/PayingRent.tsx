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
import GamePopup from './GamePopup'


interface PayingRentProps {
    open: boolean,
    land: LandInterface,
    player: number,
}

const PayingRent = ({open, land, player} : PayingRentProps) => {

 
  

  return (
      <GamePopup open={open}>
        <Paper>
          <Box>
            Paying Rent
          </Box>
        
        
    </Paper>
      </GamePopup>
  )
}

export default PayingRent