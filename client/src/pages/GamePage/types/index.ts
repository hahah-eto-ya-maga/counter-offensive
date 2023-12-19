
export type TWIN  = {
    left: number,
    bottom: number,
    width: number,
    height: number,
}


export type TKeyboard = {
    ArrowRight?: boolean,
    ArrowLeft?: boolean,
    ArrowUp?: boolean,
    ArrowDown?: boolean
}

export type TPoint = {
    x: number,
    y: number
}

export type TCheckBorder = {
    up?: boolean, 
    down?: boolean, 
    right?: boolean, 
    left?: boolean
}

export type TUnit = TPoint & {
    r: number
}

export type TScene = {
    homes: TPoint[][]
    walls: TPoint[][]
    stones: TUnit[]
}


