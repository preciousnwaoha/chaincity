import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import Paper from "@mui/material/Paper";
import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { gameActions } from "@/store/game-slice";
import { getCharacterNotSelected, shuffle } from "@/utils/functions";
import { CHARACTERS } from "@/utils/monopoly-data";

interface PlayerSelectionInterface {
    onDone: () => void,
    onBack: () => void
}

const PlayerSelection = ({onDone, onBack}: PlayerSelectionInterface) => {
    const dispatch = useDispatch()
  const game = useSelector((state: RootState) => state.game);
  const settings = useSelector((state: RootState) => state.settings);

  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [playerTypes, setPlayerTypes] = React.useState<boolean[]>([
    true,
    false,
    false,
    false,
  ]);
  const [characters, setCharacters] = React.useState<string[]>(shuffle(CHARACTERS).slice(0, 4))

  const { gameStepSequence, startingCash } = game;

  const handleSelectPlayer =(index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("event.target.value", event.target.value)
      setSelectedPlayers((prev) => {
        return [
          ...prev.slice(0, index),
          event.target.value,
          ...prev.slice(index + 1),
        ];
      });

     
    };

  const handleAddPlayer = () => {
    setSelectedPlayers((prev) => [...prev, ""]);
    setPlayerTypes((prev) => [...prev, false]);
     setCharacters((prev) => {
        return [
          ...prev,
          getCharacterNotSelected(characters, CHARACTERS),
        ];
      });
  };

  const handleTogglePlayerType = (index: number) => {
    setPlayerTypes((prev) => {
        return [
          ...prev.slice(0, index),
          !prev[index],
          ...prev.slice(index + 1),
        ];
      });
  }


  const handleDeletePlayer = () => {
    if (selectedPlayers.length < 0) {
      // ...
    }
  };

  const handlePlay = () => {
    const players = selectedPlayers.map((player, index) => {
      return {
          
        name: player,
        address: `p-${index}`,
        lands: [],
        character: characters[index],
        cash: startingCash,
        turn: index,
        trades: [],
        position: gameStepSequence[0],
        pendingRent: false,
        bankrupt: false,
        isComputer: playerTypes[index]
      };
    });

    // dispatch(gameActions.setupPlayers(players));
    onDone()
    
  };

  const handleBack = () => {
    onBack()
  }

  let canDone = true

  selectedPlayers.forEach(player => {
    if (player.trim() === ""){
        canDone = false
    }
  })

  return (
    <Box sx={{
      p: 2,
    }}>
      <Typography variant="h2">
        Player Selection
      </Typography>
      <Grid container spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {selectedPlayers.map((players, index) => {
          return (
            <Grid key={index} item xs={6} md={3}>
              <Paper sx={{
              p: 2,
              borderRadius: "12px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
                <Box sx={{
                  display: "inline-block",                    bgcolor: characters[index],
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                }}>
                    </Box>
                    <Button onClick={() => {handleTogglePlayerType(index)}}>
                        {playerTypes[index] ? "HUMAN" : "COMPUTER"}
                    </Button>
              <TextField
                variant="filled"
                value={selectedPlayers[index]}
                onChange={ handleSelectPlayer(index)}
                placeholder="Player Name"
                />
            </Paper>
            </Grid>
            
          );
        })}
        
      </Grid>
      
      <Box sx={{
        display: "flex",
        justifyContent: "space-around",
        position: "absolute",
        bottom: "0",
        left: 0,
        width: "100%",
        p: 4,
      }}>
        <Button variant="contained" onClick={handleBack} >BACK</Button>

        <IconButton onClick={handleAddPlayer} sx={{
          bgcolor: "secondary.main",
          p: 2,
          color: "white",

          "&:hover": {
            bgcolor: "secondary.light"
          }
         }} disabled={true}>+</IconButton>
        <Button variant="contained" onClick={handlePlay} disabled={!canDone}>PLAY</Button>
      </Box>
      
    </Box>
  );
};

export default PlayerSelection;
