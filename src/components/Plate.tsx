import React from 'react'
import Box from "@mui/material/Box"
import { LANDS } from '@/utils/monopoly-data'
import Land from './Land'

interface PlateProps {
  divisions: number,
}

const Plate = ({divisions=25} : PlateProps) => {
  const [cellsOccupied, setCellsOccupied] = React.useState([])

  let x = divisions
  let y = divisions

  let cellsArray = Array((x * y)).fill("cell")

  return (
    <Box sx={{
      outline: "1px solid red",
      height: "500px",
      width: "500px",
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
          width: `80%`,
          height: `80%`,
          position: "absolute",
          top: `${50}%`,
          left: `${50}%`,
          transform: "translate(-50%, -50%)",
          bgcolor: "rgba(0, 255, 0, 0.2,)",
          outline: "1px solid red",
        }}>

        </Box>
        {LANDS.map((land, index) => {
          return <Land 
            key={index}
            id={`l${index}`}
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
            divisions={25}
          />
        })}
    </Box>
  )
}

export default Plate