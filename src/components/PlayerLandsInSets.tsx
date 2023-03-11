import React from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"

import { LandInterface } from "@/utils/data.types"

type Lands = LandInterface[]
interface PlayerLandsInSetsInterface {
    groupedLands: Lands[]
}

const PlayerLandsInSets = ({groupedLands}:PlayerLandsInSetsInterface ) => {
    return <Grid container spacing={1}>
            {groupedLands.map((group, index) => {
                return <Grid item xs={6} key={index} sx={{
                    display: "flex",
                }}>
                    {group.map((land, index) => {
                        return <Box key={index}  sx={{
                            p: "3px",
                            outline: "1px solid black",
                            width: "20px",
                            height: "28px",
                        }}>
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

export default PlayerLandsInSets