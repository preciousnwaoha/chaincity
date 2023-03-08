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