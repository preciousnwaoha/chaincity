import { LandInterface } from "./data.types"

export const calculateCellsOccupied = (_startPos: number[], _endPos: number[],   ) => {
    let rowSpan = _endPos[0] - _startPos[0] + 1
    let  columnSpan = _endPos[1] - _startPos[1] + 1
    

    let cellsOccupied: [number, number][] = []

    for (let i = _startPos[0]; i < (_startPos[0] + rowSpan); i++) {
        for (let j = _startPos[1]; j < (_startPos[1] + columnSpan); j++) {
            cellsOccupied.push([i, j])
        }
    }

    return cellsOccupied

}

export const getCellSpans = (_startPos: number[], _endPos: number[],  ) => {


    return {
        rowSpan: _endPos[0] - _startPos[0] + 1,
        columnSpan: _endPos[1] - _startPos[1] + 1
    }
}

export const calculateCellPos = (_startPos: number[], _endPos: number[], divisions: number   ) => {
    return {
        xCord: (100 / divisions) * _startPos[1],
        yCord:  (100 / divisions) * _startPos[0]
    }
}

export const getLandFromID = (_landID: string,  _lands: LandInterface[]) => {
    const land = _lands.filter((land, index)=> land.id === _landID)[0]

    return land
}

export const calculatePlayerPositionOnLand = (_landPosition: {xCord: number, yCord: number}, _landSpan: {rowSpan: number, columnSpan: number}, divisions: number) => {


    return {
        xCord: _landPosition.xCord,
        yCord: _landPosition.yCord
    }
}

export const getPlayerNextPosition = (_dice1: number, _dice2: number, _currentPos: string, landIdsInSequence: string[]) => {

    const steps = _dice1 + _dice2

    const numberOfLands = landIdsInSequence.length

    const [_, pos] = _currentPos.split("-")

    const posAsNum = Number(pos)

    if ((posAsNum + steps) > numberOfLands) {
        return `land-${posAsNum - numberOfLands + steps}`
    } else {
        return `land-${posAsNum + steps}`
    }

}

