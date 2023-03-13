import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { gameActions } from "@/store/game-slice";
import { getCharacterNotSelected, shuffle } from "@/utils/functions";
import { CHARACTERS } from "@/utils/monopoly-data";

interface PlayerSelectionInterface {
    onDone: () => void
}

const PlayerSelection = ({onDone}: PlayerSelectionInterface) => {
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

  const handleDone = () => {
    const players = selectedPlayers.map((player, index) => {
      return {
          
        name: player,
        address: `p-${index}`,
        lands: [],
        character: "blue",
        cash: startingCash,
        turn: index,
        trades: [],
        position: gameStepSequence[0],
        pendingRent: false,
        bankrupt: false,
        isComputer: playerTypes[index]
      };
    });

    dispatch(gameActions.setupPlayers(players));
    onDone()
    
  };

  let canDone = true

  selectedPlayers.forEach(player => {
    if (player.trim() === ""){
        canDone = false
    }
  })

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {selectedPlayers.map((players, index) => {
          return (
            <Box key={index}>
                <Box sx={{
                    bgcolor: characters[index],
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                }}>
                    </Box>
                    <Button onClick={() => {handleTogglePlayerType(index)}}>
                        {playerTypes[index] ? "HUMAN" : "COMPUTER"}
                    </Button>
              <input
                value={selectedPlayers[index]}
                onChange={ handleSelectPlayer(index)}
                placeholder="Player Name"
                />
            </Box>
          );
        })}
        <IconButton onClick={handleAddPlayer}>+</IconButton>
      </Box>
      <Button onClick={handleDone} disabled={!canDone}> DONE</Button>
    </Box>
  );
};

export default PlayerSelection;
