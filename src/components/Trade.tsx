import React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Modal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { gameActions } from "@/store/game-slice"

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

interface TradeInterface {
    open: boolean,
    onClose: () => void
}

const Trade = ({open, onClose}: TradeInterface) => {
    const dispatch = useDispatch()
    const game = useSelector((state: RootState) => state.game)
    const [tradee, setTradee] = React.useState<number | undefined>(undefined)
    const [cashFrom, setCashFrom] = React.useState<number>(0)
    const [cashTo, setCashTo] = React.useState<number>(0)
    const [landIDsFrom, setLandIDsFrom] = React.useState<string[]>([])
    const [landIDsTo, setLandIDsTo] = React.useState<string[]>([])

    const {players, turn,} = game

    const handleTrade = () => {
        dispatch(gameActions.trade({
            from: turn,
            to: tradee!,
            cashFrom,
            cashTo,
            landIDsFrom,
            landIDsTo,
        }))
        onClose()
    }

    const handleSelectTrader = (_player: number) => {
        setTradee(_player)
    }

    return (
        <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Paper>
          <Box>
            TRADE
          </Box>
          <Box sx={{
            display: "flex",
          }}>
          {players.map((player , index)=> {
            return <Box key={index} sx={{
                bgcolor: player.character,
                borderRadius: "50%",
                width: "45px",
                height: "45px",
                outline: "1px solid black",
                outlineWidth: "2px"
            }}>

            </Box>
        })}
          </Box>
        
        
    </Paper>
        </Box>
      </Modal>
  )
}

export default Trade