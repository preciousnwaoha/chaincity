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
    mortgaged: boolean,
    houseRentFactor: number,
    image: string,
    startPos: number[],
    endPos: number[],
    owner: string,
    houses: number,
}

export interface LandSetInterface {
    id: string,
    name: string,
    color: string,
    rentWithSetFactor: number,
    sellable: boolean,
}

export interface LogInterface {
    message: string,
    timestamp: number,
}
export interface TradeInterface {
    from: number,
            to: number,
            cashFrom: number,
            cashTo: number,
            landIDsFrom: string[],
            landIDsTo: string[]
}

export interface PlayerInterface {
    name: string,
    character: string,
    address: string,
    position: string,
    cash: number,
    lands: string[],
    turn: number,
    pendingRent: boolean,
    trades: TradeInterface[],
    bankrupt: boolean,
    isComputer: boolean
}


export type NetworkType = "offchain" | "testnet" | "mainnet" | "none"
