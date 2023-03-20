import React from "react";
import Modal from '@mui/material/Modal';
import Card from "@mui/material/Card";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { LandInterface} from "@/utils/data.types";
import { calculateCellPos, getCellSpans } from "@/utils/functions";
import LandDetail from "./LandDetail";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import GamePopup from "./GamePopup";



interface LandProps {
  id: string,
        type: string, // deed, aux,
        setID: string,
        name: string,
        rent: number,
        color: string,
        mortgageFactor: number,
        unmortgageFactor: number,
        price: number,
        maxHouses: number,
        maxHotels: number,
        houseRentFactor: number,
        image: string
        startPos: number[],
        endPos: number[],
        owner: string,
        houses: number,
  divisions: number,
}

const Land = ({
  id,
  type,
  setID,
  name,
  color,
  rent,
  mortgageFactor,
  unmortgageFactor,
  price,
  maxHouses,
  maxHotels,
  houseRentFactor,
  image,
  startPos,
  endPos,
  owner,
  houses,
  divisions
}: LandProps) => {

  const settings = useSelector((state: RootState) => state.settings)
  const game = useSelector((state: RootState) => state.game)
   const [openDetails, setOpenDetails] = React.useState(false);

  const {players} = game
  const {token} = settings

  let owningPlayer = players.filter(player => player.address === owner)[0]

  const handleOpenDetails = () => setOpenDetails(true);
  const handleCloseDetails = () => setOpenDetails(false);



  const {xCord, yCord} = calculateCellPos(startPos, endPos, divisions)

  const {rowSpan, columnSpan} = getCellSpans(startPos, endPos)

  // console.log(xCord, yCord, rowSpan, columnSpan )


  return <>
    <Card elevation={0} onClick={handleOpenDetails} sx={{
    position: "absolute",
    left: `${xCord - (100 / divisions)}%`,
    top: `${yCord - (100 / divisions)}%`,
    width: `${((100 / divisions) * columnSpan)}%`,
    height: `${((100 / divisions) * rowSpan)}%`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    bgcolor: "primary.main",
    cursor: "pointer",
    border: "2px solid",
    borderRadius: 2,
    borderColor: !!owningPlayer ? owningPlayer.character : "primary.dark",
  }}>
  <Box sx={{
    bgcolor: color,
      width: "100%",
      height: "10px",

  }}>

  </Box>

  <Typography sx={{
    fontSize: {xs: `calc(7px)`, sm: `calc(8px)`, md: `calc(8px)`},
    textAlign: "center",
    textTransform: "uppercase",
    color: "primary.contrastText",
    p: "2px",

  }}>
    {name}
  </Typography>

  <Box sx={{
    position: "relative",
    width: `40%`,
    height: "40%",
    outline: "1px solid white",

    "& img": {
      objectFit: "contain",
      width: "100%",
      height: "100%"
    }
  }}>

  
  
  </Box>

  <Typography sx={{
    fontSize: `calc(100% / ${divisions / 15})`,
    textAlign: "center",
    textTransform: "uppercase",
    color: "primary.contrastText",
    p: "2px"
  }}>
  {token.symbol}{price}
  </Typography>
  </Card>
    <GamePopup
        open={openDetails}
      >
          <LandDetail 
            id={id}
            type={type}
            setID={setID}
            color={color}
            name={name}
            rent={rent}
            mortgageFactor={mortgageFactor}
            unmortgageFactor={unmortgageFactor}
            price={price}
            maxHouses={maxHouses}
            maxHotels={maxHotels}
            houseRentFactor={houseRentFactor}
            image={image}
            owner={owner}
            houses={houses}
          />
      </GamePopup>
  </>;
};

export default Land;
