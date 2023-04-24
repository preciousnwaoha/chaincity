import React, {useEffect} from 'react'
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
import {ethers} from 'ethers';
import { contractActions } from "@/store/contract-slice"
import { settingsActions } from "@/store/settings-slice";
import SelectNet from "./SelectNet";
import { getCharacterNotSelected, shuffle } from "@/utils/functions";
import { CHARACTERS } from "@/utils/monopoly-data";

import {io} from "socket.io-client";

const socket = io('http://localhost:3001');

interface StakeInterface {
    onDone: () => void,
    onBack: () => void
}

const Stake = ({onDone, onBack} : StakeInterface) => {
    const dispatch = useDispatch();
    const contract = useSelector((state: RootState) => state.contract);
    const game = useSelector((state: RootState) => state.game);
    const settings = useSelector((state: RootState) => state.settings);
    const [stake, setStake] = React.useState(0)
    const [staked, setStaked] = React.useState(false);

    
   const {provider, currentAccount, balance, tokenBalance, tokenContract} = contract
   const {players, startingCash, gameStepSequence} =  game

   useEffect(() => {

    socket.on('get-room-state', (players) => {
        console.log("Get room state");
        dispatch(gameActions.updatePlayers(players));
    })

    socket.on("player-joined-room", (players) => {
        const newPlayer = players[players.length - 1]
        console.log("Welcome", newPlayer.name);
        // dispatch(gameActions.addPlayer(player));
        dispatch(gameActions.updatePlayers(players));
    })

   }, [players])

   
   const handleStakeChange = (event: any) => {
    setStake(event.target.value)
   }

   const roomId = "10"

    const handleStake = () => {
        //check
        if (stake < 0.1) {
            return
        }

        const player = {
          
            name: `Player ${players.length + 1}`,
            address: currentAccount,
            lands: [],
            character: CHARACTERS[players.length],
            cash: startingCash,
            turn: players.length + 1,
            trades: [],
            position: gameStepSequence[0],
            pendingRent: false,
            bankrupt: false,
            stake: stake,
            isComputer: false

          }

         

          // add player on chain

          
            socket.emit('join-room', {roomId, player});
         // ---
        // add player socket
        setStaked(true);
        
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
        <Typography variant="h2">Stake Tokens</Typography>
      
        <Paper sx={{
            p: 2,
            width: "100%",
            borderRadius: "12px",
            minHeight: "40vh"
        }}>
            <>
            {!staked ? <>
                <Typography>Stake MATIC</Typography>
            <Typography>Matic Balance: {balance}</Typography>
            <input type="number" max={tokenBalance} min={0.1} onChange={handleStakeChange}/>
                <Button onClick={handleStake}>STAKE</Button>
            </>: <Box>
                Staked {stake} MATIC
                </Box>}
            </>
            
             </Paper>
            
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
        }} disabled={!staked}>ENTER GAME</Button>
        </Grid>
        </Box>

        
        

    </Box>
  )
}

export default Stake