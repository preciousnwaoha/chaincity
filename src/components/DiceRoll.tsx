import React, { useEffect } from 'react'
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import GamePopup from './GamePopup';
import {io} from "socket.io-client";

const socket = io('http://localhost:3001');

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
    const contract = useSelector((state : RootState) => state.contract)
    const [open, setOpen] = React.useState(false);
    const [dices, setDices] = React.useState<undefined | number[]>(undefined)
    const [rolling, setRolling] = React.useState(false);
    // const [rolled, setRolled] = React.useState(false);

    const {turn, players, roomId} = game
    const {currentAccount} = contract;
    
    const isClientTurn = players[turn].address === currentAccount


    const handleDiceRoll = () => {
        let dice1 =  Math.ceil(Math.random() * 6)
        let dice2 = Math.ceil(Math.random() * 6)

        setRolling(true)

        setTimeout(() => {
          setDices([dice1, dice2])
          setRolling(false)

          setTimeout(() => {
            setDices(undefined)
              setOpen(false)
              onRollDice(dice1, dice2)
              socket.emit('dice-roll', {roomId, dice1, dice2})
        
          }, 2000)

        }, 1000)
    }


    useEffect(() => {
      socket.emit('rejoin', {roomId})

        socket.on('dice-roll', ({dice1, dice2}) => {
          console.log(`Player ${turn + 1} rolled dice.`)
          setRolling(true)

        setTimeout(() => {
          setDices([dice1, dice2])
          setRolling(false)

          setTimeout(() => {
            setDices(undefined)
              setOpen(false)
        
          }, 2000)

        }, 1000)
        })
    }, [dices, rolling])

    useEffect(() => {
        setOpen(true)
        
    }, [turn])

    const dicesOn = dices !== undefined

  return (
      <GamePopup open={open}>
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
          <Typography sx={{
            textAlign: "center",
            fontSize: "1.5rem",
            color: "primary.contrastText",
            my: 2,
          }}>{players[turn].name}</Typography>
          <Box sx={{
            width: "40px",
            height: "40px",
            bgcolor: players[turn].character,
            borderRadius: "50%"
          }}>


          </Box>
        {(rolling)&& <Typography sx={{
          extAlign: "center",
          fontSize: "1.5rem",
          color: "primary.contrastText",
        mt: 2,

        }} >{isClientTurn ? "You're" : `Player ${turn + 1}`} Rolling...</Typography> }
        
         {(dicesOn && !rolling) && <Typography sx={{
          p: 2,
          color: "white",
         }}>{dices[0]} : {dices[1]}</Typography>}

         
       {(!dicesOn && !rolling && isClientTurn) && <Button variant="contained" onClick={handleDiceRoll} sx={{
        mt: 2,
       }} >ROLL DICE</Button>}

       {(!dicesOn && !rolling && !isClientTurn) && <Box>Wating for {`Player ${turn + 1} to roll`}</Box>}
       
    </Box>
      </GamePopup>
        
    
  )
}

export default DiceRoll