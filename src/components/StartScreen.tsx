import React, {useState} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from 'next/router'
import { useDispatch } from "react-redux";
import { gameActions } from "@/store/game-slice";

import { PLAYERS_DUM } from '@/utils/dummy-data'
import { LANDS, LAND_SETS } from '@/utils/monopoly-data'

import {io} from "socket.io-client";

const socket = io('http://localhost:3001');


interface startScreenInterface {
    onHandleNewGame: () => void
}

const StartScreen = ({onHandleNewGame}: startScreenInterface) => {
    const dispatch = useDispatch();

  const usedLands = LANDS.map((land, index) => {
    return {
      id: `land-${index + 1}`,
      type: land.type,
    setID: land.setID,
    color: land.color,
    name: land.name,
    rent: land.rent,
    mortgageFactor: land.mortgageFactor,
    unmortgageFactor: land.unmortgageFactor,
    mortgaged: false,
    price: land.price,
    maxHouses: land.maxHouses,
    maxHotels: land.maxHotels,
    houseRentFactor: land.houseRentFactor,
    image: land.image,
    startPos: land.startPos,
    endPos: land.endPos,
    owner: "",
    houses: 0,
    }
  
  })

  let gameStepSequence = [...usedLands.map((_, index) => `land-${index + 1}`)]

  
  const roomId = "10"

  const handleCreateGame = () => {

    
    // create game on chain

    const stateData = {
      text: "create game"
    }

    // get gameId and cityId
    socket.emit('join-room', {roomId, stateData})

    dispatch(gameActions.createGame({
      lands: usedLands,
      gameStepSequence,
      startingCash: 1500,
      bankCash: 100000,
      landSets: LAND_SETS,
      gameId: 100,
      cityId: 100,
    }))

    // new game

    onHandleNewGame()
  }

  const handleJoinGame = () => {
    // Client-side code: Join a room with a specific room ID.
    const stateData = {text: "join game"}
    socket.emit('join-room', {roomId, stateData});
    onHandleNewGame()
  }


    
    return <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
        }}>
        <Typography variant="h1" sx={{
            color: "#fffff",
            textTransform: "uppercase",
            mb: 4,
        }}>Chaincity</Typography>
        
        <Button variant="contained" onClick={handleCreateGame} sx={{
            mb: 4
        }}>CREATE GAME</Button>
        <Button variant="contained" onClick={handleJoinGame} sx={{
          mb: 4
      }}>JOIN GAME</Button>
        <Grid container item  sx={{
            border: "1px solid red",
            justifyContent: "center"
        }}>
        <Button variant="contained" sx={{
            m: 2
        }} >HELP</Button>
            <Button variant="contained" sx={{
                m: 2
            }}>OPTIONS</Button>
            <Button variant="contained" sx={{
                m: 2
            }}>QUIT</Button>
        </Grid>
    </Box>
}

export default StartScreen