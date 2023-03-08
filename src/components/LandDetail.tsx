import React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

import { LandInterface } from "@/utils/data.types"
import Deed from "./Deed"

interface LandDetailProps {
    id: string,
          type: string, // deed, aux,
          setID: string,
          name: string,
          rent: number,
          color: string,
          mortgageFactor: number,
          unmortgageFactor: number,
          price: number,
          maxHouses: number,
          maxHotels: number,
          houseRentFactor: number,
          image: string
  }

const LandDetail = ({
    id,
  type,
  setID,
  name,
  color,
  rent,
  mortgageFactor,
  unmortgageFactor,
  price,
  maxHouses,
  maxHotels,
  houseRentFactor,
  image,
}: LandDetailProps) => {
    let currency = "$"

    let priceAtState = price

  return (
    <Box>
        <Typography sx={{
            textAlign: "center"
        }}>For Sale</Typography>
        
        <Typography sx={{
            textAlign: "center",
            border: 1,
        }}>{currency} {priceAtState}</Typography>

        <Box sx={{
            p: 1,
        }}>
            <Deed
                id={id}
                type={type}
                setID={setID}
                color={color}
                name={name}
                rent={rent}
                mortgageFactor={mortgageFactor}
                unmortgageFactor={unmortgageFactor}
                price={price}
                maxHouses={maxHouses}
                maxHotels={maxHotels}
                houseRentFactor={houseRentFactor}
                image={image}
            />
             
        </Box>

    </Box>
  )
}

export default LandDetail