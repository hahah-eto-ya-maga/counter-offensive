import { TPoint, TUnit, TWIN } from "../../types/types"

export interface ICollisionOptions {
    WIN: TWIN
    blocksArray: TPoint[][]
    circlesArray: TUnit[]
}

class Collision {
    WIN: TWIN
    blocksArray: TPoint[][]
    circlesArray: TUnit[]
    constructor (options: ICollisionOptions) {
        const {WIN, blocksArray, circlesArray} = options
        this.WIN = WIN;
        this.blocksArray = blocksArray;
        this.circlesArray = circlesArray
    }
    
    collisionBlockUnit (block: TPoint[], unit: TUnit): boolean {
        let collition: boolean
        let nearX = Math.max(block[0].x, Math.min(unit.x, block[2].x));
        let nearY = Math.max(block[0].y, Math.min(unit.y, block[2].y));
        const nearVector: TPoint = {x: nearX - unit.x, y: nearY - unit.y}
        let lengthVector = nearVector.x * nearVector.x + nearVector.y * nearVector.y
        if (lengthVector < unit.r * unit.r) {
            lengthVector = Math.sqrt(lengthVector)
            let direction = {x: nearVector.x/lengthVector, y: nearVector.y/lengthVector}
            let overlap = unit.r - lengthVector
            if (overlap == unit.r) overlap = 0
            this.WIN.left -= overlap * direction.x
            this.WIN.bottom -= overlap * direction.y
            return collition = true
            }
        return collition = false
    }

    collisionBlockDeadUnit(block: TPoint[], deadTank: TUnit): boolean {
        let collition: boolean
        let nearX = Math.max(block[0].x, Math.min(deadTank.x, block[2].x));
        let nearY = Math.max(block[0].y, Math.min(deadTank.y, block[2].y));
        const nearVector: TPoint = {x: nearX - deadTank.x, y: nearY - deadTank.y}
        let lengthVector = nearVector.x * nearVector.x + nearVector.y * nearVector.y
        if (lengthVector < deadTank.r * deadTank.r) {
            lengthVector = Math.sqrt(lengthVector)
            let direction = {x: nearVector.x/lengthVector, y: nearVector.y/lengthVector}
            let overlap = deadTank.r - lengthVector
            if (overlap == deadTank.r) overlap = 0
            deadTank.x -= overlap * direction.x
            deadTank.y -= overlap * direction.y
            return collition = true
            }
        return collition = false
    }

    collisionCircleUnit(circle: TUnit, unit: TUnit): boolean {
        let collition: boolean
        const nearVector: TPoint = {x: circle.x - unit.x, y: circle.y - unit.y}
        let lengthVector = Math.sqrt(nearVector.x * nearVector.x + nearVector.y * nearVector.y)
        let direction = {x: nearVector.x/lengthVector, y: nearVector.y/lengthVector}
        let overlap = unit.r + circle.r - lengthVector
        if (overlap == unit.r) overlap = 0
        if (overlap > 0) {
            this.WIN.left -= overlap * direction.x
            this.WIN.bottom -= overlap * direction.y
            return collition = true
        } 
        return collition = false
    }

    collisionCircleDeadUnit (circle: TUnit, deadTank: TUnit): boolean {
        let collition: boolean
        const nearVector: TPoint = {x: circle.x - deadTank.x, y: circle.y - deadTank.y}
        let lengthVector = Math.sqrt(nearVector.x * nearVector.x + nearVector.y * nearVector.y)
        let direction = {x: nearVector.x/lengthVector, y: nearVector.y/lengthVector}
        let overlap = deadTank.r + circle.r - lengthVector
        if (overlap == deadTank.r) overlap = 0
        if (overlap > 0) {
            deadTank.x -= overlap * direction.x
            deadTank.y -= overlap * direction.y
            return collition = true
        } 
        return collition = false
    }

    collisionUnitDeadUnit (deadUnit: TUnit, unit: TUnit): boolean {
        let collition: boolean
        const nearVector: TPoint = {x: deadUnit.x - unit.x, y: deadUnit.y - unit.y}
        let lengthVector = Math.sqrt(nearVector.x * nearVector.x + nearVector.y * nearVector.y)
        let direction = {x: nearVector.x/lengthVector, y: nearVector.y/lengthVector}
        let overlap = 0.5 * (unit.r + deadUnit.r - lengthVector)
        if (overlap == unit.r) overlap = 0
        if (overlap > 0) {
            this.WIN.left -=  overlap * direction.x
            this.WIN.bottom -= overlap * direction.y
            deadUnit.x += overlap * direction.x
            deadUnit.y += overlap * direction.y
            return collition = true
        } 
        return collition = false
    }

    checkAllBlocksUnit (unit: TUnit, deadTank: TUnit, collision: boolean, isTank?: boolean): boolean {
        let flagCollision = false
        this.blocksArray.forEach((block) => {
            if ((block[0].x >= Math.floor(unit.x - 2) && block[2].x <= Math.ceil(unit.x + 2) && block[0].y <=  Math.ceil(unit.y)  && block[2].y >= Math.floor(unit.y)) || 
            (block[0].y >= Math.floor(unit.y - 2) && block[2].y <=  Math.ceil(unit.y + 2) && block[0].x <= Math.ceil(unit.x) && block[2].x >= Math.floor(unit.x))) {
                flagCollision = this.collisionBlockUnit(block, unit) || flagCollision
                this.collisionBlockDeadUnit(block, deadTank)
            }
        })

        this.circlesArray.forEach((circle) => {
            flagCollision = this.collisionCircleUnit(circle, unit) || flagCollision
            this.collisionCircleDeadUnit(circle, deadTank)
        })
        if (isTank) flagCollision = this.collisionUnitDeadUnit(deadTank, unit) || flagCollision
        return collision = flagCollision
    }

}

export default Collision