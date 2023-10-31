import React from "react";
import { TWIN, TPoint, TCheckBorder, TUnit } from "../../types/types";

interface IMath {
    WIN: TWIN
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

    scalarProd(a:TPoint, b:TPoint): number {
        return a.x * b.x + a.y * b.y;
    }


    multyBlock(polygon: TPoint[]): TPoint[][] {
        const bloksArray: TPoint[][] = []
        let pointLeftDown: TPoint = {x:0,y:0} 
        let pointRightUp: TPoint = {x:0,y:0}
        for (let i = 0; i < polygon[2].x; i++) {
            for (let j = 0; j < polygon[2].y; j++) {
                pointLeftDown = {x:0, y:0}
                pointRightUp = {x:0, y:0}
                pointLeftDown.x = polygon[0].x + i
                pointRightUp.x = pointLeftDown.x + 1
                pointLeftDown.y = polygon[0].y + j
                pointRightUp.y = pointLeftDown.y + 1
                bloksArray.push([pointLeftDown, pointLeftDown, pointRightUp, pointRightUp])
            }
        }
        return bloksArray
    }

}

export default MathGame;