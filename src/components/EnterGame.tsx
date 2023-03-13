import React from "react";
import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { useRouter } from 'next/router'
import { useDispatch } from "react-redux";
import { gameActions } from "@/store/game-slice";

const EnterGame = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const handleEnterGame = () => {
        dispatch(gameActions.startGame())
        router.push("/game")
    }
    
    return <Box>
        <Button onClick={handleEnterGame}>
            ENTER GAME
        </Button>
    </Box>
}

export default EnterGame