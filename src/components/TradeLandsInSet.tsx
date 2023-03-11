import React from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"

import { LandInterface } from "@/utils/data.types"

type Lands = LandInterface[]
interface TradeLandsInSetInterface {
    groupedLands: Lands[],
    onUpdateSelectedLands: (arr: string[])=> void
}

const TradeLandsInSet = ({groupedLands, onUpdateSelectedLands}:TradeLandsInSetInterface ) => {
    const [selectedLandsIds, setSelectedLandsIds] = React.useState<string[]>([])

    const  handleUpdateTradeLands = (_land: LandInterface) => {
        let arr: string[]= []

        if (selectedLandsIds.includes(_land.id)) {
            let arr = [...selectedLandsIds]
            let indexOfLand = selectedLandsIds.indexOf(_land.id)

            arr = [...arr.slice(0, indexOfLand), ...arr.slice(indexOfLand)]
        }else {
            arr = [...selectedLandsIds, _land.id]
        }

        setSelectedLandsIds(arr)

        onUpdateSelectedLands(arr)
    }


    return <Grid container spacing={1} sx={{
        p: 2,
    }}>
            {groupedLands.map((group, index) => {
                return <Grid item xs={6} key={index} sx={{
                    display: "flex",
                }}>
                    {group.map((land, index) => {
                        return <Box key={index}  sx={{
                            p: "3px",
                            outline: selectedLandsIds.includes(land.id) ? `1px solid purple` : "1px solid black",
                            width: "20px",
                            height: "28px",
                            mx: 1,
                            cursor: "pointer",
                            
                            
                        }} onClick={() => {handleUpdateTradeLands(land)}}>
                            <Box  sx={{
                            bgcolor: land.color,
                            width: "100%",
                            height: "100%",
                            
                        }}>

                        </Box>
                        </Box>
                    })}
                </Grid>
            })}
        </Grid>
}

export default TradeLandsInSet