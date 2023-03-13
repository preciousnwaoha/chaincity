import { LandInterface } from "./data.types"
import { CHARACTERS } from "./monopoly-data"

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


type LandGroupType = LandInterface[]
export const groupPlayerLandsInSets = (landIDs: string[], allLands: LandInterface[]) => {
    let playerLands = landIDs.map(id => getLandFromID(id, allLands))
    let setsFromLands = allLands.map(land => land.setID)
    let sets = setsFromLands.filter((set, index) => setsFromLands.indexOf(set) === index )

    
    let landsGrouped : LandGroupType[] = []

    for (let i = 0; i < sets.length; i++) {
        let arr:LandInterface[] = []
        for (let land of playerLands) {
            if (land.setID === sets[i]) {
                arr.push(land)
            }
        }
        landsGrouped.push(arr)
    }

    return landsGrouped


}
export const getLandsWithSameSetAs = (land:LandInterface, lands: LandInterface[])  => {
    return lands.filter(_land => _land.setID === land.setID )
}

export const getHousesBuiltInSet = (setID: string, lands:LandInterface[]) => {
    let houses = 0

    let setLands = lands.filter(land => land.setID === setID)

    for (let land of setLands) {
        houses += land.houses
    }

    return houses
}


export const getCharacterNotSelected = (selected: string[], characters: string[]) =>
 {
    
   return shuffle(characters.filter(char => !CHARACTERS.includes(char)))[0]
 }

// helpers

export function shuffle (array: any[]) {
  let newArr = [...array]
  let currentIndex = newArr.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArr[currentIndex], newArr[randomIndex]] = [
      newArr[randomIndex], newArr[currentIndex]];
  }

  return newArr
}


export function formatTime(_stamp: number) {
  var hours = Math.floor(_stamp / 60 / 60)

  var minutes = Math.floor(_stamp / 60) - (hours * 60)
  var seconds = Math.floor(_stamp % 60)

  var formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return formatted

}