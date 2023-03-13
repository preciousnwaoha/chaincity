import Box from '@mui/material/Box'
import React, { useEffect } from 'react'
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from '@mui/material/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { getHousesBuiltInSet, getLandFromID } from '@/utils/functions'
import Deed from './Deed'
import { gameActions } from '@/store/game-slice'
import PayingRent from './PayingRent'
import Trade from './Trade'

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
    const playerHasCashToBuild = (land.rent * 10) <= player.cash

    const housesBuiltInSet = getHousesBuiltInSet(land.setID, lands)

    const playerCanPayRent = (land.rent <= player.cash)

    // const playerCanBankrupt = 

    const playerCanMortgage = (land.mortgaged === false) && (housesBuiltInSet === 0)

    const handleBuy = () => {
      console.log("buy")
      setActioning(true)
      dispatch(gameActions.buyLand({player: turn, landID}))
      setActioning(false)
    }


    
    
    const handleBuild = () => {
      console.log("build")
      setActioning(true)
      setActioning(false)
    }

    const handleSell = () => {
      console.log("sell")
      setActioning(true)
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
    
  :  <Modal
  open={open}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
  <Paper>
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
    {!hasOwner && <Button onClick={handleBuy}>BUY</Button>}
    {isOwner &&<>
      <Button onClick={handleBuild} disabled={playerHasCashToBuild}>BUILD</Button>
      <Button onClick={handleSell} >SELL</Button>
      <Button onClick={handleMortgage} disabled={!playerCanMortgage}>MORTGAGE</Button>
      <Button onClick={handleUnmortgage} disabled={!playerCanUnmortgage}>UNMORTGAGE</Button>

    </>}
    </Box>
    <Box>
      <Button onClick={handleFinish}>FINISH</Button>
      <Button onClick={handleOpenTrading}>TRADE</Button>
    </Box>
  
  
</Paper>
  </Box>
</Modal>}
    </>
       
  )
}

export default PlayerActions