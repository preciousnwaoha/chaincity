import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useRouter } from 'next/router'
import Paper from "@mui/material/Paper";
import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { gameActions } from "@/store/game-slice";
import { getCharacterNotSelected, shuffle } from "@/utils/functions";
import { CHARACTERS } from "@/utils/monopoly-data";

import {io} from "socket.io-client";
import { PlayerInterface } from "@/utils/data.types";

const socket = io('http://localhost:3001');

const AddPlayer = () => {
    const router = useRouter()
    const dispatch = useDispatch()
  const game = useSelector((state: RootState) => state.game);
  const settings = useSelector((state: RootState) => state.settings);
  const contract = useSelector((state: RootState) => state.contract)

    const {players, gameStepSequence, startingCash, gameId, cityId, playing } = game;
    const {currentAccount} = contract;

    const roomId = "10";

    
    const isStarter = (currentAccount === players[0].address);

    
      let canStartGame =isStarter && (players.length >= 2)

      
   console.log({playing})

      const handleStartGame = () => {
        // startgame on chain
        console.log('red')
        // startgame on socket
        socket.emit('start-game', {roomId, turn: 0})
        dispatch(gameActions.startGame())
       
      };

      useEffect(() => {
        socket.emit('rejoin', {roomId})
        console.log("blue")
        socket.on('started-game', (turn) => {
          console.log("started game in ", turn)
          dispatch(gameActions.startGame())
        })

        if (playing === true) {
          router.push("/game")
        }
      }, [playing])
  

  return (
    <Box sx={{
        p: 2,
      }}>
         <Typography variant="h2">
        Adding Players
      </Typography>
      <Box sx={{
        display: "flex",
        justifyContent: "space-around",
        position: "absolute",
        bottom: "0",
        left: 0,
        width: "100%",
        p: 4,
      }}>

<Grid container spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {players.map((player, index) => {
          return (
            <Grid key={index} item xs={6} md={3}>
              <Paper sx={{
              p: 2,
              borderRadius: "12px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
                <Typography>{player.name}</Typography>
                <Typography>{player.address}</Typography>
                <Typography>{player.stake} MATIC</Typography>
            </Paper>
            </Grid>
            
          );
        })}
        
      </Grid>
       
        <Button variant="contained" onClick={handleStartGame} disabled={!canStartGame}>START GAME</Button>
      </Box>
      
      </Box>
  )
}

export default AddPlayer