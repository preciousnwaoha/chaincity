import React, {useState} from "react";
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
import { NetworkType } from "@/utils/data.types";
import { contractActions } from "@/store/contract-slice";
import { ethers } from "ethers";

interface SelectNetInterface {
    onSelectedNet: () => void,
    onBack: () => void
}

const SelectNet = ({onSelectedNet, onBack}: SelectNetInterface) => {
    const dispatch = useDispatch()
    const settings = useSelector((state: RootState) => state.settings)
   const {network} = settings
   const contract = useSelector((state: RootState) => state.contract)
   const {provider, currentAccount, tokenContract} = contract

    const disconnected = currentAccount === ""

    const canNext = !disconnected && (network !== "none")

    const handleNetwork = (_net: NetworkType) => {
      dispatch(settingsActions.setupNet(_net))
    }
    
    const handleSelectedNet = () => {
        onSelectedNet()
    }

    const handleBack = () => {
        onBack()
    }



   

  return (
    <Box sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
         justifyContent: "center",
    }}>
        <Typography variant="h2">Select Game Type</Typography>
         <Box sx={{
          bgcolor: "primary.dark",
          borderRadius: "12px",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 2
        }}>
        
        <Paper elevation={0} variant="outlined" onClick={() => {handleNetwork("testnet")}} sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100px",
          height: "100px",
          bgcolor: "transparent",
          border: "2px solid",
          borderColor: (network === "testnet") ? "secondary.main" : "rgba(0,0,0,0.5)",
          borderRadius: "12px",
          color: "#ffffff",
        //   margin: {xs: 0, md: "0 1rem 0 0"},
          cursor: "pointer",
          transition: ".3s",

          "&:hover": {
            borderColor: "secondary.main"
          }
        }}>
          Testnet
        </Paper>
        <Divider orientation="vertical" sx={{
            m: 2,
            bgcolor: "black",
            color: "black"
        }}/>
        <Paper elevation={0} variant="outlined" onClick={() => {handleNetwork("mainnet")}} sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100px",
          height: "100px",
          bgcolor: "transparent",
          border: "2px solid",
          borderColor: (network === "mainnet") ? "secondary.main" : "rgba(0,0,0,0.5)",
          borderRadius: "12px",
          color: "#ffffff",
        //   margin: {xs: 0, md: "0 1rem 0 0"},
          cursor: "pointer",

          "&:hover": {
            borderColor: "secondary.main"
          }
        }}>
          Mainnet
        </Paper>

        
        </Box>
        
        {!disconnected && <Typography>Connected</Typography>}
        
        <Box sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            p: 2,
        }}>
            <Grid container item sx={{
            my: 2,
            justifyContent: "space-around",
        }}>
            <Button variant="contained" onClick={handleBack}>
            BACK
        </Button>
            <Button variant="contained" onClick={handleSelectedNet} disabled={!canNext}>
            NEXT
        </Button>
        </Grid>
        </Box>
        
        
    </Box>
       
  )
}

export default SelectNet