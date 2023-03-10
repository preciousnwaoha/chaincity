import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import Box from "@mui/material/Box"
import Land from './Land'
import Player from './Player'
import { RootState } from '@/store'
import DiceRoll from './DiceRoll'
import PlayerActions from './PlayerActions'
import { gameActions } from '@/store/game-slice'
import { getLandFromID, getPlayerNextPosition } from '@/utils/functions'
import { LandInterface } from '@/utils/data.types'
// import PayingRent from './PayingRent'

interface PlateProps {
  divisions: number,
}

const Plate = ({divisions} : PlateProps) => {
  const dispatch = useDispatch()
  const game = useSelector((state: RootState) => state.game)

  const [showCurrentPlayerActions, setShowCurrentPlayerActions] = React.useState(false)
  // const [cellsOccupied, setCellsOccupied] = React.useState([])
  // const [playerMoved, setPlayerMoved] = React.useState(false)





  const {players, lands,  turn, gameStepSequence} = game

  
  const player = players[turn]
  console.log(player.position)
  const {position} = player
  
  let x = divisions
  let y = divisions

  let cellsArray = Array((x * y)).fill("cell")

  // const handlePayRent = (_landID: string) => {
  //   const land = getLandFromID(_landID, lands)
  //   const hasOwner = !!land.owner
  //   const isOwner = land.owner === player.address
  //   if (hasOwner && !isOwner) {
  //     dispatch(gameActions.payRent({player: turn, landID: player.position}))
      
  //   }
  // }
  

  const handleRollDice = (_dice1: number, _dice2: number, ) => {
    
    const currentPlayer = players[turn]

    const playerNextPos = getPlayerNextPosition(_dice1, _dice2, currentPlayer.position, gameStepSequence)
    
    dispatch(gameActions.moveTo({player: turn, landID: playerNextPos}))
    // setPlayerMoved(false)

    // handlePayRent(playerNextPos)
  
    setShowCurrentPlayerActions(true);

  }

  const handleFinishTurn = () => {
    setShowCurrentPlayerActions(false)
    dispatch(gameActions.nextTurn())
  }

  



  return (
    <Box sx={{
      outline: "1px solid red",
      height: "100%",
      width: "100%",
      boxSizing: "border-box",
      display: "inline-block",
      position: "relative"

    }}>
        {cellsArray.map((cell, index) => {
          return <Box key={index} sx={{
            display: "block",
            float: "right",
            outline: "1px solid rgba(0,0,0,0.1)",
            width: `calc(100% / ${x})`,
            height: `calc(100% / ${y})`,
            m: 0,
            boxSizing: "border-box",
          }}>

          </Box>
        })}

        <Box sx={{
          width: `70%`,
          height: `70%`,
          position: "absolute",
          top: `${50}%`,
          left: `${50}%`,
          transform: "translate(-50%, -50%)",
          bgcolor: "rgba(0, 255, 0, 0.2,)",
          outline: "1px solid red",
        }}>

        </Box>
        {lands.map((land, index) => {
          return <Land 
            key={index}
            id={`land-${index + 1}`}
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
            startPos={land.startPos}
            endPos={land.endPos}
            owner={land.owner}
            houses={land.houses}
            divisions={divisions}
          />
        })}

        {players.map((player, index) => {
          return <Player key={index}
            character={player.character}
            name={player.name}
            cash={player.cash}
            position={player.position}
          />
        })}
        
        <DiceRoll onRollDice={handleRollDice} />
        {showCurrentPlayerActions && <PlayerActions open={showCurrentPlayerActions} onFinishTurn={handleFinishTurn} />}
        
    </Box>
  )
}

export default Plate