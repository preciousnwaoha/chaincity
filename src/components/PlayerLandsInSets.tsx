import React from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"

import Divider from "@mui/material/Divider"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { groupAllLandsInSets, groupPlayerLandsInSets } from "@/utils/functions"
import { LandInterface } from "@/utils/data.types"

type Lands = LandInterface[]
interface PlayerLandsInSetsInterface {
    player: number,
}

const PlayerLandsInSets = ({player}:PlayerLandsInSetsInterface ) => {
    const game = useSelector((state: RootState) => state.game)
    
    const {players, turn, lands, landSets} = game
    const groupedLands=groupAllLandsInSets(lands)
    console.log(groupedLands)
    
    return <Box sx={{

    }}>
        <Divider sx={{
            m: 1,
        }}/>
        <Grid container spacing={2} sx={{
            p: 2
        }}>
            {groupedLands.map((group, index) => {
                return <Grid item xs={6} key={index} sx={{
                     
                }}>
                    <Box sx={{
                        display: "flex",
                    }}>
                        {group.map((land, index) => {
                        return <Box key={index}  sx={{
                            p: "3px",
                            outline: "1px solid black",
                            outlineColor: land.color,
                            width: "14px",
                            height: "18px",
                            mr: 1,
                        }}>
                            <Box  sx={{
                            bgcolor: players[player].lands.includes(land.id) ? land.color : "",
                            width: "100%",
                            height: "100%",
                        }}>

                        </Box>
                        </Box>
                    })}
                    </Box>
                    
                </Grid>
            })}
        </Grid>
        <Divider sx={{
            m: 1
        }}/>
        </Box>
}

export default PlayerLandsInSets