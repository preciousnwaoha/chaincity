import React, { useEffect } from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Modal from "@mui/material/Modal"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { gameActions } from "@/store/game-slice"
import TradePlate from "./TradePlate"

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
    const [pendingTrades, setPendingTrades] = React.useState(false)
  
    

    const {players, turn,} = game

    const player = players[turn]

    const {trades} = player

    const offers = trades.filter(trade => trade.from !== turn)

    const handleTraderData = (traderLandIds: string[], traderCash: number) => {
      setLandIDsFrom(traderLandIds)
      setCashFrom(traderCash)
    }

    const handleTradeeData = (tradeeLandIds: string[], tradeeCash: number) => {
      setLandIDsTo(tradeeLandIds)
      setCashTo(tradeeCash)
    }


    const handlePlaceTrade = () => {
        dispatch(gameActions.placeTrade({
            from: turn,
            to: tradee!,
            cashFrom,
            cashTo,
            landIDsFrom,
            landIDsTo,
        }))
        onClose()
    }

    const handleRejectTrade = (_trader:number) => {
      dispatch(gameActions.rejectTrade({
        player: turn,
        trader: _trader
      }))
      setPendingTrades(false)
      onClose()
    }
    const handleAcceptTrade = (_trader:number) => {
      
      dispatch(gameActions.acceptTrade({
        player: turn,
        trader: _trader
      }))
      setPendingTrades(false)
      onClose()
    }

    const handleCancelTrade = () => {

      onClose()
    }

    const handleSelectTradee = (_player: number) => {
        setTradee(_player)
    }

    useEffect(() => {
      if (offers.length > 0) {
        setPendingTrades(true)
      }
    }, [pendingTrades, offers])


    let canPlaceTrade = ((tradee !== undefined) && ((landIDsFrom.length > 0) || (cashFrom > 0)) && ((landIDsTo.length > 0) || (cashTo > 0)))

    console.log(tradee, landIDsFrom, cashFrom, landIDsTo, cashTo)
    

    return (
      <>
      {pendingTrades ?
       <Modal
       open={open}
       aria-labelledby="modal-modal-title"
       aria-describedby="modal-modal-description"
     >
       <Box sx={style}>
       <Paper>
         <Box>
           
           <Typography>OFFER</Typography>
         </Box>
         <Grid container spacing={1}>
           <Grid item xs={6}> 

               <TradePlate trader={turn} onGetTradeData={handleTradeeData} />
           </Grid>
           <Grid item xs={6}>
           <TradePlate trader={offers[0].from} onGetTradeData={handleTraderData} />
           </Grid>
         </Grid>
         
         <Button onClick={() => {handleAcceptTrade(offers[0].from)}}>ACCEPT OFFER</Button>
          <Button onClick={() => {handleRejectTrade(offers[0].from)}}>REJECT OFFER</Button>
   </Paper>
       </Box>
     </Modal>
      :
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Paper>
          <Box>
            
            <Typography>TRADE</Typography>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Box sx={{
            display: "flex",
          }}>
                <Box  sx={{
                    bgcolor: player.character,
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    mr: 2,}}>

                </Box>
              </Box>
              <TradePlate trader={turn} onGetTradeData={handleTraderData} />
            </Grid>
            <Grid item xs={6}>
            <Box sx={{
            display: "flex",
          }}>
          {players.map((player , index)=> {
            if (index === turn) {
              return <div key={index}></div>
            }
            return <Box key={index} sx={{
                bgcolor: player.character,
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                mr: 2,
                cursor: "pointer",
                outline: (index === tradee) ? "1px solid black": "",
                outlineOffset: "2px",

                "&: hover": {
                  outline: "1px solid black",
                outlineOffset: "2px",
                }
            }} onClick={() => {handleSelectTradee(index)}}>

            </Box>
            
        })}
          </Box>
          {(tradee !== undefined) && <TradePlate trader={tradee!} onGetTradeData={handleTradeeData} />}
            </Grid>
          </Grid>
          
        
        <Button onClick={handlePlaceTrade} disabled={!canPlaceTrade}>PLACE TRADE</Button>
        <Button onClick={handleCancelTrade}>CANCEL</Button>
    </Paper>
        </Box>
      </Modal>}
      </>
        
  )
}

export default Trade