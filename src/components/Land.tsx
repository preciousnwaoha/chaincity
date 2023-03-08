import React from "react";
import Card from "@mui/material/Card";

import { LandInterface} from "@/utils/data.types";
import { calculateCellPos, getCellSpans } from "@/utils/functions";

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
  divisions=20
}: LandProps) => {

  const {xCord, yCord} = calculateCellPos(startPos, endPos, divisions)

  const {rowSpan, columnSpan} = getCellSpans(startPos, endPos)

  console.log(xCord, yCord, rowSpan, columnSpan )


  return <Card sx={{
    position: "absolute",
    left: `${xCord - (100 / divisions)}%`,
    top: `${yCord - (100 / divisions)}%`,
    width: `${((100 / divisions) * columnSpan)}%`,
    height: `${((100 / divisions) * rowSpan)}%`,
    bgcolor: color,
  }}>
    
  </Card>;
};

export default Land;
