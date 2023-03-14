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

    let rents = Array(maxHouses + maxHotels).fill(0)
    rents = rents.map((_, index) => {
        return (rent * ((index + 1 ) * houseRentFactor))
    })

    console.log(rents)

  return (
    
        <Box sx={{
            bgcolor: "primary.fade",
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
                    textTransform: "uppercase",
                    p: 1,
                    color: "black"
                }}>Title deed <br/> <b>{name}</b></Typography>
                

                </Box> 

                <Typography sx={{
                    bgcolor: "primary.light",
                    textTransform: "uppercase",
                    color: "primary.contrastText",
                    p: 1,
                    textAlign: "center",
                }}>rent {token.symbol}{rent}</Typography>
                
                
                <Box sx={{
                    px: 2,
                    mt: 1,
                }}>
                    {rents.map((rent, index) => {
                    return <Box key={index} sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 0.5,
                    }}>
                        <Typography >{"With " + (index + 1) + " House"}</Typography>
                        <Typography>{token.symbol} {rent}</Typography>
                    </Box>
                })}
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                <Typography >Mortgage Value {token.symbol}{price * mortgageFactor} </Typography>
                <Typography >House cost {price * 10} </Typography>
                </Box>
                <Typography sx={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    p: 1,
                }}>price {token.symbol}{price}</Typography>
                </Box>
            </Box>
             
  )
}

export default Deed