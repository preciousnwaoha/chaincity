export interface LandInterface {
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
    } 
