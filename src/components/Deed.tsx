import React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useSelector } from "react-redux"
import { RootState } from "@/store"


interface DeedProps {
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
          image: string,
          owner: string,
          houses: number,
  }

  
const Deed = ({
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
  owner,
  houses,
}: DeedProps) => {
    const settings = useSelector((state: RootState) => state.settings)
    const game = useSelector((state: RootState) => state.game)

    const {token} = settings
    const {players, turn} = game

    let priceAtState = price

  return (
    
        <Box sx={{
            p: 1,
        }}>
            <Box sx={{
                p: 0.5,
                border: 1
            }}>
               <Box sx={{
                bgcolor: color,
                textAlign: "center"
               }}>
                <Typography sx={{
                    textTransform: "uppercase"
                }}>Title deed</Typography>
                <Typography sx={{
                    textTransform: "uppercase"
                }}>{name}</Typography>

                </Box> 

                <Typography sx={{
                    bgcolor: "info.main",
                    textTransform: "uppercase",
                    p: 1,
                }}>rent {token.symbol}{rent}</Typography>
                <Typography sx={{
                    bgcolor: "info.main",
                    textTransform: "uppercase",
                    p: 1,
                }}>price {token.symbol}{price}</Typography>
                

                </Box>
            </Box>
             
  )
}

export default Deed