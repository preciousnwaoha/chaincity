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

  

  const handleSetupGame = () => {
    dispatch(gameActions.setupGamePlay({
      lands: usedLands,
      gameStepSequence,
      startingCash: 1500,
      bankCash: 100000,
      landSets: LAND_SETS
    }))

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
        
        <Button variant="contained" onClick={handleSetupGame} sx={{
            mb: 4
        }}>NEW GAME</Button>
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