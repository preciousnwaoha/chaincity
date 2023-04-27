import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { gameActions} from "@/store/game-slice";
import { contractActions } from "@/store/contract-slice"
import {ethers} from 'ethers';

import { PLAYERS_DUM } from '@/utils/dummy-data'
import { LANDS, LAND_SETS } from '@/utils/monopoly-data'

import {io} from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL!);


interface startScreenInterface {
    onHandleNewGame: () => void
}

const StartScreen = ({onHandleNewGame}: startScreenInterface) => {
    const dispatch = useDispatch();
  const contract = useSelector((state: RootState) => state.contract)
  const game = useSelector((state: RootState) => state.game)
  const [showNoRoom, setShowNoRoom] = React.useState(false)
  const {cityId} = game
  const {currentAccount, signer, gameContract} = contract;
  


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

  

  const handleCreateGame = async () => {

    
    // create game on chain
    const createGameTxn = await gameContract!.connect(signer!).createGame(1, 1500, process.env.NEXT_PUBLIC_INPUTAUTH, {gasLimit: 100000})
    await createGameTxn.wait();

    const cityId = 1
    const gameId = createGameTxn

    console.log(gameId)

    const roomId = `${Math.random() * 10000000000^2}`
    
    socket.emit('create-room', {roomId})

    dispatch(gameActions.createGame({
      lands: usedLands,
      gameStepSequence,
      startingCash: 1500,
      bankCash: 100000,
      landSets: LAND_SETS,
      gameId,
      cityId,
      roomId,
    }))

    // new game


    onHandleNewGame()
  }

  const handleJoinGame = () => {

    socket.emit('join-room')
    
    
  }

  useEffect(() => {

    socket.on('no-room-found', () => {
      setShowNoRoom(true)
    })

    socket.on('joined-room', ({roomId, gameId}) => {
      const cityId = 1

      dispatch(gameActions.createGame({
        lands: usedLands,
        gameStepSequence,
        startingCash: 1500,
        bankCash: 100000,
        landSets: LAND_SETS,
        gameId,
        cityId,
        roomId,
      }))

      onHandleNewGame()
    })

  }, [game])


  useEffect(() => {
    if (showNoRoom === true) {
      setTimeout(() => {
        setShowNoRoom(false)
      }, 3000)
    }
  }, [showNoRoom])


    
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
        {showNoRoom ? <Box>No Room Found</Box> : <Button variant="contained" onClick={handleJoinGame} sx={{
          mb: 4
      }}>JOIN GAME</Button>}
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