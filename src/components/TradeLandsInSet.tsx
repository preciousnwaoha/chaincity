import React from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { groupAllLandsInSets, groupPlayerLandsInSets } from "@/utils/functions"
import { LandInterface } from "@/utils/data.types"

type Lands = LandInterface[]
interface TradeLandsInSetInterface {
    player: number,
    onUpdateSelectedLands: (arr: string[])=> void
}

const TradeLandsInSet = ({player, onUpdateSelectedLands}:TradeLandsInSetInterface ) => {
    const game = useSelector((state: RootState) => state.game)
    
    const {players, turn, lands, landSets} = game

    const groupedLands=groupAllLandsInSets(lands)
    
    const [selectedLandsIds, setSelectedLandsIds] = React.useState<string[]>([])

    const  handleUpdateTradeLands = (_land: LandInterface) => {
        let arr: string[]= []

        if (!players[player].lands.includes(_land.id)) {
            return
        }

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
                    // display: "flex",

                }}>
                    <Box sx={{
                        display: "flex",
                        // flexWrap: "wrap"
                    }}>
                        {group.map((land, index) => {
                        return <Box key={index}  sx={{
                            p: "3px",
                            outline: "1px solid black",
                            outlineColor: land.color,
                            width: "15px",
                            height: "22px",
                            minWidth: "15px",
                            minHeight: "22px",
                            mr: 1,
                            mb: 1,
                            opacity: selectedLandsIds.includes(land.id) ? 1 : 0.4
                        }}>
                            <Box  sx={{
                            bgcolor: players[player].lands.includes(land.id) ? land.color : "",
                            width: "100%",
                            height: "100%",
                        }} onClick={() => {handleUpdateTradeLands(land)}}>

                        </Box>
                        </Box>
                    })}
                    </Box>
                    
                </Grid>
            })}
        </Grid>
}

export default TradeLandsInSet