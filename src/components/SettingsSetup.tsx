import React, {useState} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { gameActions } from "@/store/game-slice";
import { settingsActions } from "@/store/settings-slice";
import SelectNet from "./SelectNet";
import SetupToken from "./SetupToken";

interface SettingsSetupInterface {
  onDone: () => void,
  onBack: () => void,
}

const SettingsSetup = ({onDone, onBack}: SettingsSetupInterface) => {
 
  const dispatch = useDispatch()
    const settings = useSelector((state: RootState) => state.settings)
    const [showTokenSetup, setShowTokenSetup] = React.useState(false)
    
    const {network} = settings 



  const handleNetSelected = () => {
    setShowTokenSetup(true)
  }

  const handleDone = () => {
    dispatch(gameActions.startGame())
        onDone()
  }

  const handleBackFromNet = () => {
    onBack()
  }

  const handleBackFromToken = () => {
    setShowTokenSetup(false)
  }

  return (
    <Box sx={{
      width: "100%",
      height: "100vh",
      display: "flex",
      position: "relative",
      justifyContent: "center",
      alignItems: "center"
      }}>
        {!showTokenSetup && <SelectNet onSelectedNet={handleNetSelected} onBack={handleBackFromNet} />}
      {showTokenSetup && <SetupToken onDone={handleDone} onBack={handleBackFromToken} />}
      
    </Box>
  )
}

export default SettingsSetup