import React from "react";
import { TWIN } from "../TWIN";

interface IMath {
    WIN: TWIN
}

type TPoint = {
    x: number,
    y: number
}

class MathGame {
    WIN: TWIN;

    constructor(options: IMath) {
        const {WIN} = options
        this.WIN = WIN;
    }

    calcCenter(polygon: TPoint[]):TPoint {
        let x = Math.abs(polygon[0].x - polygon[3].x)/2
        let y = Math.abs(polygon[0].y - polygon[3].y)/2
        return {x: x, y: y}
    }
    

}

export default MathGame;