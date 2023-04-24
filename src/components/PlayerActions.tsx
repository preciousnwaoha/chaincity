import Box from '@mui/material/Box'
import React, { useEffect } from 'react'
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from '@mui/material/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { buildCash, checkMonopoly, getHousesBuiltInSet, getLandFromID } from '@/utils/functions'
import Deed from './Deed'
import { gameActions } from '@/store/game-slice'
import PayingRent from './PayingRent'
import Trade from './Trade'
import GamePopup from './GamePopup'

import {io} from "socket.io-client";
import { LandInterface } from '@/utils/data.types'

const socket = io('http://localhost:3001');

interface PlayerActionsProps {
    open: boolean,
    onFinishTurn: () => void,
}

const PlayerActions = ({open, onFinishTurn} : PlayerActionsProps) => {
  const dispatch = useDispatch()
  const game = useSelector((state: RootState) => state.game)
  const [actioning, setActioning] = React.useState(false)
  // const [paidRent, setPaidRent] = React.useState(false)
  const [trading, setTrading] = React.useState(false)

  const {turn, players, lands} = game

    const player = players[turn]

    const {position: landID, cash, pendingRent, trades} = player

    const land = getLandFromID(landID, lands)

    
    const hasOwner = !!land.owner
    const isOwner = land.owner === player.address

    const playerHasCashToBuy = land.price <= player.cash
    const playerCanUnmortgage = ((land.unmortgageFactor * land.price) <= player.cash) && land.mortgaged
    const playerHasCashToBuild = buildCash(land) <= player.cash

    const housesBuiltInSet = getHousesBuiltInSet(land.setID, lands)

    const playerCanPayRent = (land.rent <= player.cash)

    const playerHasMonopoply = checkMonopoly(lands, land, player)

    const playerCanBuild = (playerHasCashToBuild && playerHasMonopoply)
    const playerCanSell = (land.houses > 0) && isOwner
    console.log({playerHasMonopoply}, "hello")

    // const playerCanBankrupt = 

    const playerCanMortgage = (land.mortgaged === false) && (housesBuiltInSet === 0)

    const roomId = 10;

    const handleBuy = () => {
      console.log("buy")
      setActioning(true)

      const stateData = {player: turn, landID}
      socket.emit('buy-land', {roomId, stateData})
      dispatch(gameActions.buyLand(stateData))
      setActioning(false)
    }


    
    
    const handleBuild = () => {
      
      setActioning(true)
      const stateData = {land, player: turn}
      socket.emit('build', {roomId, stateData})
      dispatch(gameActions.build(stateData))
      setActioning(false)
    }

    const handleSell = () => {
      setActioning(true)
      const stateData = {land, player: turn}
      socket.emit('sell', {roomId, stateData})
      dispatch(gameActions.sell(stateData))
      setActioning(false)
    }

    const handleMortgage = () => {

      if (playerCanMortgage) {
        setActioning(true)
        const stateData = {player: turn, landID}
        socket.emit('mortgage', {roomId, stateData})
        dispatch(gameActions.mortgage(stateData))
        setActioning(false)
      }
      console.log("Mortgage")
    }
    const handleUnmortgage = () => {
      if (playerCanUnmortgage) {
        setActioning(true)
        const stateData = {player: turn, landID}
        socket.emit('unmortgage', {roomId, stateData})
        dispatch(gameActions.unmortgage(stateData))
        setActioning(false)
      }
      console.log("Unmortgage")
    }
    const handleOpenTrading = () => {
      setActioning(true)
      setTrading(true)
      socket.emit('open-trading', {roomId})
    }
    const handleCloseTrading = () => {
      setTrading(false)
      setActioning(false)
      socket.emit('close-trading', {roomId})
    }

    const handleDeclareBankrupcy = () => {
      let landOwnerIndex = players.length

      for (let i = 0; i < players.length; i++) {
        if (players[i].address === land.owner) {
          landOwnerIndex = i
        }
      }
      const stateData = {player: turn, bankrupter: landOwnerIndex}
      socket.emit('bankrupt', {roomId, stateData})
      dispatch(gameActions.bankrupt(stateData))

    }

    const handleFinish = () => {
        onFinishTurn()
    }
    
      useEffect(() => {
        socket.emit('rejoin', {roomId})
        if (pendingRent) {
          const stateData = {player: turn, landID}
          socket.emit('pay-rent', {roomId, stateData})
          dispatch(gameActions.payRent(stateData))
        }
      }, [pendingRent, dispatch, turn, landID])

      
      useEffect(() => {
        socket.on('buy-land', ({ roomId, stateData}: {roomId: string, stateData: {
          player: number, landID: string,
        } }) => {
          console.log('bought land')
          dispatch(gameActions.buyLand(stateData))
        })

        socket.on('mortgage', ({ roomId, stateData}: {roomId: string, stateData: {
          player: number, landID: string,
        } }) => {
          console.log('mortgaged land')
          dispatch(gameActions.mortgage(stateData))
        })

        socket.on('unmortgage', ({ roomId, stateData}: {roomId: string, stateData: {
          player: number, landID: string,
        } }) => {
          console.log('unmor land')
          dispatch(gameActions.unmortgage(stateData))
        })
        socket.on('pay-rent', ({ roomId, stateData}: {roomId: string, stateData: {
          player: number, landID: string,
        } }) => {
          console.log('pay rent')
          dispatch(gameActions.payRent(stateData))
        })

        socket.on('bankrupt', ({ roomId, stateData}: {roomId: string, stateData: {
          player: number, bankrupter: number,
        } }) => {
          console.log('bankrupt')
          dispatch(gameActions.bankrupt(stateData))
        })


        socket.on('build', ( { roomId, stateData}: {roomId: string, stateData: {
          land: LandInterface, player: number
        } }) => {
          console.log('build')
          dispatch(gameActions.build(stateData))
        })

        socket.on('sell', ( { roomId, stateData}: {roomId: string, stateData: {
          land: LandInterface, player: number
        } }) => {
          console.log('sell')
          dispatch(gameActions.sell(stateData))
        })


        socket.on('open-trading', () => {
          setTrading(true)
        setActioning(true)
        })
        socket.on('close-trading', () => {
          setTrading(false)
          setActioning(false)
        })
      }, [game, trading])

  return (
    <>
    {actioning
    ? 
    <>
      {playerCanPayRent ? 
      <PayingRent open={pendingRent} land={land} player={turn} />
      : <Button onClick={handleDeclareBankrupcy}>Bankrupt</Button>
    }
    <Trade open={trading} onClose={handleCloseTrading} />
    </>
    
  :  <GamePopup
  open={open}
  
>
  
  <Paper >
    <Box>
    <Deed
      id={land.id}
      type={land.type}
      setID={land.setID}
      color={land.color}
      name={land.name}
      rent={land.rent}
      mortgageFactor={land.mortgageFactor}
      unmortgageFactor={land.unmortgageFactor}
      price={land.price}
      maxHouses={land.maxHouses}
      maxHotels={land.maxHotels}
      houseRentFactor={land.houseRentFactor}
      image={land.image}
      owner={land.owner}
      houses={land.houses}
    />
    <Box sx ={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap"
    }}>
    {!hasOwner && <Button sx={{
      m: 1
    }} variant="contained" onClick={handleBuy}>BUY</Button>}
    {isOwner &&<>
      <Button sx={{
        m: 1
      }} variant="contained" onClick={handleBuild} disabled={!playerCanBuild}>BUILD</Button>
      <Button sx={{
        m: 1
      }} variant="contained" onClick={handleSell} disabled={!playerCanSell}>SELL</Button>
      </>}
      </Box>

      <Box sx ={{
      display: "flex",
      justifyContent: "center",
      // flexWrap: "wrap"
    }}>

      {isOwner && <><Button sx={{
        m: 1
      }} variant="contained" onClick={handleMortgage} disabled={!playerCanMortgage}>MORTGAGE</Button>
      <Button sx={{
        m: 1
      }} variant="contained" onClick={handleUnmortgage} disabled={!playerCanUnmortgage}>UNMORTGAGE</Button></> 

    }
    </Box>
      
    
    
    </Box>
    <Grid container item sx ={{
      display: "flex",
      justifyContent: "center",
    }}>
      <Button sx={{
        m: 1
      }} variant="contained" onClick={handleFinish}>FINISH</Button>
      <Button sx={{
        m: 1
      }} variant="contained" onClick={handleOpenTrading}>TRADE</Button>

      
      
    </Grid>
  
  
</Paper>
</GamePopup>}
    </>
       
  )
}

export default PlayerActions