export interface LandInterface  {
    id: string,
    type: string, // deed, aux,
    setID: string,
    color: string,
    name: string,
    rent: number,
    mortgageFactor: number,
    unmortgageFactor: number,
    price: number,
    maxHouses: number,
    maxHotels: number,
    houseRentFactor: number,
    image: string,
    startPos: number[],
    endPos: number[],
    owner: string,
    houses: number,
}

export interface LogInterface {
    message: string,
    timestamp: number,
}

export interface PlayerInterface {
    name: string,
    character: string,
    address: string,
    position: string,
    cash: number,
    lands: string[],
    turn: number,
}