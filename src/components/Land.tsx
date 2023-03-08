import React from "react";
import Modal from '@mui/material/Modal';
import Card from "@mui/material/Card";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { LandInterface} from "@/utils/data.types";
import { calculateCellPos, getCellSpans } from "@/utils/functions";
import LandDetail from "./LandDetail";

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
  divisions
}: LandProps) => {

   const [openDetails, setOpenDetails] = React.useState(false);
  const handleOpenDetails = () => setOpenDetails(true);
  const handleCloseDetails = () => setOpenDetails(false);

  const {xCord, yCord} = calculateCellPos(startPos, endPos, divisions)

  const {rowSpan, columnSpan} = getCellSpans(startPos, endPos)

  console.log(xCord, yCord, rowSpan, columnSpan )


  return <>
    <Card onClick={handleOpenDetails} sx={{
    position: "absolute",
    left: `${xCord - (100 / divisions)}%`,
    top: `${yCord - (100 / divisions)}%`,
    width: `${((100 / divisions) * columnSpan)}%`,
    height: `${((100 / divisions) * rowSpan)}%`,
    bgcolor: "rgba(0,0,0,0.6)",
    cursor: "pointer",
  }}>
  <Box sx={{
    bgcolor: color,
      width: "100%",
      height: "10px",

  }}>

  </Box>

  <Typography sx={{
    fontSize: `calc(100% / ${divisions / 10})`,
    textAlign: "center",
    textTransform: "uppercase"
  }}>
    {name}
  </Typography>

  <Box sx={{
    position: "relative",
    width: `40%`,
    height: "40%",
    outline: "1px solid red",

    "& img": {
      objectFit: "contain",
      width: "100%",
      height: "100%"
    }
  }}>

  
  
  </Box>

  <Box sx={{

  }}>
  
  </Box>
  </Card>
    <Modal
        open={openDetails}
        onClose={handleCloseDetails}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
          />
        </Box>
      </Modal>
  </>;
};

export default Land;
