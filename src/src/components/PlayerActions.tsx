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

    const handleBuy = () => {
      console.log("buy")
      setActioning(true)
      dispatch(gameActions.buyLand({player: turn, landID}))
      setActioning(false)
    }


    
    
    const handleBuild = () => {
      
      setActioning(true)
      dispatch(gameActions.build({land, player: turn}))
      setActioning(false)
    }

    const handleSell = () => {
      setActioning(true)
      dispatch(gameActions.sell({land, player: turn}))
      setActioning(false)
    }

    const handleMortgage = () => {

      if (playerCanMortgage) {
        setActioning(true)
        dispatch(gameActions.mortgage({player: turn, landID}))
        setActioning(false)
      }
      console.log("Mortgage")
    }
    const handleUnmortgage = () => {
      if (playerCanUnmortgage) {
        setActioning(true)
        dispatch(gameActions.unmortgage({player: turn, landID}))
        setActioning(false)
      }
      console.log("Unmortgage")
    }
    const handleOpenTrading = () => {
      setActioning(true)
      setTrading(true)
    }
    const handleCloseTrading = () => {
      setTrading(false)
      setActioning(false)
    }

    const handleDeclareBankrupcy = () => {
      let landOwnerIndex = players.length

      for (let i = 0; i < players.length; i++) {
        if (players[i].address === land.owner) {
          landOwnerIndex = i
        }
      }

      dispatch(gameActions.bankrupt({player: turn, bankrupter: landOwnerIndex}))

    }

    const handleFinish = () => {
        onFinishTurn()
    }
    
      useEffect(() => {
        if (pendingRent) {
          dispatch(gameActions.payRent({player: turn, landID}))
        }
      }, [pendingRent, dispatch, turn, landID])

      


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