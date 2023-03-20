import React from 'react'
import Box from "@mui/material/Box"

interface PlaneProps {
  divisions: number,
}

const Plane = ({divisions} : PlaneProps) => {

  const [cellsOccupied, setCellsOccupied] = React.useState([])
  
  let x = divisions
  let y = divisions

  let cellsArray = Array((x * y)).fill("cell")



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

    </Box>
  )
}

export default Plane