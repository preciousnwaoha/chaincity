import React from 'react'
import Box from "@mui/material/Box"
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { calculateCellPos, calculatePlayerPositionOnLand, getCellSpans, getLandFromID } from '@/utils/functions'

interface PlayerProps {
    character: string, 
    name: string, 
    cash: number,
    position: string,
    turn: number
}

const Player = ({character, name, cash, position, turn}: PlayerProps) => {
    const plane = useSelector((state: RootState) => state.plane)
    const game = useSelector((state: RootState) => state.game)

    const {divisions} = plane
    const {lands} = game

    const land = getLandFromID(position, lands)

    const landPosition = calculateCellPos(land.startPos, land.endPos, divisions)

    const landSpan = getCellSpans(land.startPos, land.endPos)

    const {xCord, yCord} = calculatePlayerPositionOnLand(landPosition, landSpan, divisions)


  return (
    <Box sx={{
        width: `${(100 / divisions)}%`,
        height: `${(100 / divisions)}%`,
        position: `absolute`,
        top: `calc(${yCord}% + ${turn*3}px)`,
        left: `calc(${xCord}% + ${turn*3}px)`,
        bgcolor: character,
        borderRadius: "50%",
    }}>

    </Box>
  )
}

export default Player