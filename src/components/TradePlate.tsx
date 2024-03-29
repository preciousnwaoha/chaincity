import React from "react"
import Box from "@mui/material/Box"
import { LandInterface } from "@/utils/data.types"
import { groupPlayerLandsInSets } from "@/utils/functions"
import { RootState } from "@/store"
import { useSelector } from "react-redux"
import TradeLandsInSet from "./TradeLandsInSet"
import gameSlice from "@/store/game-slice"
import { Input, Typography } from "@mui/material"

interface TradePlateInterface {
    trader: number,
    onGetTradeData: (tradeLandIds: string[], tradeCash: number) => void
}

const TradePlate = ({ trader, onGetTradeData} : TradePlateInterface) => {
    const game = useSelector((state: RootState) => state.game)
    // const settings = useSelector((state: RootState) => state.settings)
    // const [tradeLandIds, setTradeLandIds] = React.useState<string[]>([])
    const [cash, setCash] = React.useState<number>(0)
    const [landIDs, setLandIDs] = React.useState<string[]>([])

    const {players, lands} = game

    const handleUpdateTraderLands = (tradeLandIds: string[]) => {
        setLandIDs(tradeLandIds)
        onGetTradeData(
            tradeLandIds,
            cash
        )
    }

    const handleUpdateTraderCash = (event: any) => {
        setCash(event.target.value)
        onGetTradeData(
            landIDs,
            event.target.value
        )
    }

    const landsGroupedInSets = groupPlayerLandsInSets(players[trader].lands, lands)
    return <Box>
        <TradeLandsInSet player={trader} onUpdateSelectedLands={handleUpdateTraderLands}/>
        
        <Box sx={{
            px: 2,
        }}>
            <input
                type="number"
                value={cash}
                max={players[trader].cash}
                min={0}
                onChange={handleUpdateTraderCash}

            />
        </Box>
    </Box>
}

export default TradePlate