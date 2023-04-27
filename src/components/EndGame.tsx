import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { RootState } from '@/store';
import GamePopup from './GamePopup';
import { gameActions } from '@/store/game-slice'
import Trade from './Trade'

import {io} from "socket.io-client";
import { PlayerInterface } from '@/utils/data.types';
import { useRouter } from 'next/router'

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL!);

interface EndGameInterface {
    winnerPlayer: PlayerInterface,

}

const EndGame = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const game = useSelector((state : RootState) => state.game)
    const contract = useSelector((state : RootState) => state.contract)
    // const [open, setOpen] = React.useState(true);
    const [gameEnded, setGameEnded] = React.useState(false)

    const {turn, players, fallingOrder, roomId, gameId} = game
    const {currentAccount, gameContract, signer} = contract

    const winnerPlayer = players.filter(player => player.bankrupt === false)[0]
    const clientIsWinner = currentAccount === winnerPlayer.address


    

    const handleEndGame = async () => {
        let winAddrOrder = []

        for (let i = fallingOrder.length - 1; i >= 0; i++) {
            let playerIndex = fallingOrder[i]
            winAddrOrder.push(playerIndex + 1)
        }
        

        // end on chain
        const endGameTxn = await gameContract!.connect(signer!).endGame(gameId, winAddrOrder, winnerPlayer.cash, process.env.NEXT_PUBLIC_INPUTAUTH!)
        await endGameTxn.wait()

        // end socket
        socket.emit('end-game', {roomId})
        setGameEnded(true)
    }

    useEffect(() => {
        socket.emit('rejoin', {roomId})

        socket.on('end-game', () => {
            setGameEnded(true)
        })

    }, [])

    const handleBackHome = () => {
        dispatch(gameActions.endGame())
        router.push("/")
    }


  return (
    <GamePopup open={true}>
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
        
        {gameEnded ? <Box>
            <Typography>
                Winner has ended game
            </Typography>
            <Button onClick={handleBackHome}>HOME</Button>
        </Box> :<>
        {clientIsWinner ? 
        <Box>
            <Typography>
                You win
            </Typography>
            <Typography>
                Finished With
            </Typography>
            <Typography>
                {winnerPlayer.cash} tokens.
            </Typography>

            <Button onClick={handleEndGame}>
                END GAME
            </Button>
        </Box>
        : <Box>
                <Typography>
            {`${winnerPlayer.name} has wins.`}
            </Typography>
            <Typography>
            finishing with
            </Typography>
            <Typography>
            {`${winnerPlayer.cash} tokens.`}
            </Typography>
            </Box>}
        </>}
        
        </Box>
      </GamePopup>
        
  )
}

export default EndGame