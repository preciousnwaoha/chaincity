import React from 'react'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { gameActions } from "@/store/game-slice";
import { settingsActions } from "@/store/settings-slice";
import SelectNet from "./SelectNet";

interface SetupTokenInterface {
    onDone: () => void,
    onBack: () => void
}

const SetupToken = ({onDone, onBack} : SetupTokenInterface) => {
    const contract = useSelector((state: RootState) => state.contract)
    const [stake, setStake] = React.useState(0)
    const [buyAmount, setBuyAmount] = React.useState(0)

   const {provider, currentAccount, balance, tokenBalance} = contract

   const handleStakeChange = (event: any) => {
    setStake(event.target.value)
   }

   const handleBuyAmountChange = (event: any) => {
    setStake(event.target.value)
   }

    const handleDone = () => {
        onDone()
    }
    const handleBack = () => {
        onBack()
    }

    

  return (
    <Box sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        // border: "1px solid red",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
         justifyContent: "center",
        p: 2,
    }}>
        <Typography variant="h2">Token Setup</Typography>
        <Grid container spacing={2} sx={{
            // border: 1,
            width: "100%",
            // pl: 2,
        }}>
            <Grid item xs={12} md={6}>
                <Paper sx={{
                    p: 2,
                    width: "100%",
                    borderRadius: "12px",
                    minHeight: "40vh"
                }}>
                    <Typography>Stake Token</Typography>
                    <Typography>Matic Balance: {balance}</Typography>
                    <Typography>Token Balance: {tokenBalance}</Typography>
                    <input type="number" max={tokenBalance} min={0.05} onChange={handleStakeChange}/>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper sx={{
                     p: 2,
                     width: "100%",
                     borderRadius: "12px",
                     minHeight: "40vh"
                }}>
                    
                    <Typography>Buys Token</Typography>
                    
                    <Typography>Matic Balance: {balance}</Typography>
                    <input type="number" max={balance} min={0.05} onChange={handleBuyAmountChange}/>
                </Paper>
            </Grid>
        </Grid>
        <Box sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            p: 2,
        }}>
             <Grid container sx={{
            justifyContent: "space-around"
        }}>
            <Button variant="contained" onClick={handleBack} sx={{
            my: 2
        }}>BACK</Button>
            <Button variant="contained" onClick={handleDone} sx={{
            my: 2
        }} disabled={stake === 0}>ENTER GAME</Button>
        </Grid>
        </Box>

        
        

    </Box>
  )
}

export default SetupToken