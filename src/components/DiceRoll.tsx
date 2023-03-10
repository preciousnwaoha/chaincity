import React, { useEffect } from 'react'
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

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

interface DiceRollProps {
    onRollDice: (a: number, b: number) => void,
}

const DiceRoll = ({onRollDice}: DiceRollProps) => {
    const game = useSelector((state : RootState) => state.game)
    const [open, setOpen] = React.useState(false);
    const [dices, setDices] = React.useState<null | number[]>(null)
    const [rolling, setRolling] = React.useState(false);

    const {turn, players} = game


    const handleDiceRoll = () => {
        let dice1 = 5 // Math.ceil(Math.random() * 6)
        let dice2 = 4 // Math.ceil(Math.random() * 6)

        setRolling(true)

        setTimeout(() => {
          setDices([dice1, dice2])
          setRolling(false)
        }, 2000)
        

        setTimeout(() => {
            
            setOpen(false)
            
            onRollDice(dice1, dice2)
        }, 1000)

        

        
    }

    useEffect(() => {
        setOpen(true)
    }, [turn])

  return (
    <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Paper>
          <Typography>{players[turn].name}</Typography>
        {rolling && <Typography >Rolling...</Typography> }
         {(!rolling && !!dices) && <Typography >{dices[0]} : {dices[1]}</Typography>}
       {!rolling && <Button onClick={handleDiceRoll}>ROLL</Button>}
    </Paper>
        </Box>
      </Modal>
    
  )
}

export default DiceRoll