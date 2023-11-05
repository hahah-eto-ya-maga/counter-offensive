import React from "react";
import Canvas, { ICanvasOption } from "../../modules/Graph/Canvas/Canvas";
import MathGame from "../../modules/Graph/Math/MathGame";
import { useEffect, useState } from "react";
import {TKeyboard, TPoint, TUnit, TCheckBorder } from "../../modules/types/types";
import useCanvas from "../../modules/Graph/Canvas/useCanvas";
import "./GamePage.css"

const TankGamePage: React.FC = () => {

    const height = window.innerHeight - 26;
    const width = window.innerWidth - 26;
    const prop = width / height;

    let canvas: Canvas
    const Canvas = useCanvas((FPS) => renderScene(FPS))

    const [FPS, setShowFPS] = useState<number>(0)

    const keyPressed: TKeyboard = {}

    const man: TUnit = {x: 7, y: 3, r: 0.3}
    const tankU: TUnit = {x: 5, y: 4, r:0.4}
    const tank: TPoint[] = [{x:-0.4, y:- 0.4}, {x:-0.4, y: 0.4}, {x:0.4, y: 0.4}, {x:0.4, y: -0.4}] 

    const WIN = {
        left: -8 * prop + tankU.x,
        bottom: -8 + tankU.y,
        width: 16 * prop,
        height: 16,
    };

    const math = new MathGame({WIN})
    let angleOfMovement = Math.PI/2;
    const speedRotate = Math.PI/256;
    const speedTank = 1/20;
    let speedTankNow = speedTank;
    const vectorTank: TPoint = {x: 0, y: 1}
    
    const speedInfantry = 1/16;
    let speedInfantryNow = speedInfantry

    const blocksArray: TPoint[][] = [[{x:5, y: 6}, {x:5, y: 8}, {x:7, y: 8}, {x:7, y: 6}], [{x:6, y: 9}, {x:6, y: 10}, {x:7, y: 10}, {x:7, y: 9}], 
        [{x:8, y: 9}, {x:8, y: 10}, {x:9, y: 10}, {x:9, y: 9}], [{x:6, y: 8.5}, {x:6, y: 9}, {x:11, y: 9}, {x:11, y: 8.5}],
        [{x:-1, y: -1}, {x:-1, y: 61}, {x:0, y: 61}, {x:0, y: -1}], [{x:0, y: -1}, {x:0, y: 0}, {x:75, y: 0}, {x:75, y: -1}],
        [{x:75, y: -1}, {x:75, y: 61}, {x:76, y: 61}, {x:76, y: -1}], [{x:0, y: 60}, {x:0, y: 61}, {x:75, y: 61}, {x:75, y: 60}],]
    const circleArray: TUnit[] = [{x: 8, y: 6, r: 0.5}, {x: 9, y: 5, r: 0.3}, {x: 3.5, y: 6.5, r: 0.2}]
    const deadTank: TUnit = {x: 7.5, y: 3, r: 0.4}
    
    let collition: boolean = false

    

    useEffect(() => {
        canvas = Canvas({
            id: 'canvas',
            width: width,
            height: height,
            WIN: WIN,
            callbacks: {
                keydown: (event) => {keyDown(event)},
                keyup: (event) => {keyUp(event)}
            }
        });

        return () => {
            canvas.clearRect();
        };
    }, [])


    const keyDown = (event: KeyboardEvent): void => {
        if (event.code ==='ArrowUp' || event.code ==='KeyW') { 
            keyPressed.ArrowUp = true
        }
        if (event.code ==='ArrowDown' || event.code ==='KeyS') { 
            keyPressed.ArrowDown = true
        }
        if (event.code ==='ArrowRight' || event.code ==='KeyD') { 
            keyPressed.ArrowRight = true    
        }
        if (event.code ==='ArrowLeft' || event.code ==='KeyA') { 
            keyPressed.ArrowLeft = true    
        }       
    }

    const keyUp = (event: KeyboardEvent): void => {
        if (event.code ==='ArrowUp' || event.code ==='KeyW') { 
            keyPressed.ArrowUp = false
        }
        if (event.code ==='ArrowDown' || event.code ==='KeyS') { 
            keyPressed.ArrowDown = false   
        }
        if (event.code ==='ArrowRight' || event.code ==='KeyD') { 
            keyPressed.ArrowRight = false    
        }
        if (event.code ==='ArrowLeft' || event.code ==='KeyA') { 
            keyPressed.ArrowLeft = false    
        }       
    }

    /* движение танка по карте*/
    const moveSceneTank = (keyPressed: TKeyboard) => {
        collition ? speedTankNow = speedTank / 4 : speedTankNow = speedTank 
        vectorTank.y = Math.sin(angleOfMovement) * speedTankNow;
        vectorTank.x = Math.cos(angleOfMovement) * speedTankNow;
        if(keyPressed.ArrowUp) {
            WIN.bottom += vectorTank.y
            WIN.left += vectorTank.x
        } 
        if(keyPressed.ArrowDown) {
            WIN.bottom -= vectorTank.y
            WIN.left -= vectorTank.x
        }

        tankU.x = WIN.left + 8 * prop;
        tankU.y = WIN.bottom + 8

        if (keyPressed.ArrowLeft && keyPressed.ArrowDown) {
            angleOfMovement -= speedRotate
        } else if (keyPressed.ArrowLeft) {
            angleOfMovement += speedRotate
        }

        if (keyPressed.ArrowRight && keyPressed.ArrowDown) {
            angleOfMovement += speedRotate
        } else if (keyPressed.ArrowRight) {
            angleOfMovement -= speedRotate
        }  
    }

    const turnTanks = (keyPressed: TKeyboard) => {
        const cosRotate = Math.cos(speedRotate);
        const sinRotate = Math.sin(speedRotate)
        tank.forEach(point => {
            let x = point.x, y = point.y
            if (keyPressed.ArrowLeft && keyPressed.ArrowDown) {
                x = point.x * cosRotate + point.y * sinRotate
                y = point.y * cosRotate - point.x * sinRotate
                point.x = x;
                point.y = y
            } else if (keyPressed.ArrowLeft) {
                x = point.x * cosRotate - point.y * sinRotate
                y = point.y * cosRotate + point.x * sinRotate
                point.x = x;
                point.y = y
            }
            
            if (keyPressed.ArrowRight && keyPressed.ArrowDown) {
                x = point.x * cosRotate - point.y * sinRotate
                y = point.y * cosRotate + point.x * sinRotate
                point.x = x;
                point.y = y
            } else if (keyPressed.ArrowRight) {
                x = point.x * cosRotate + point.y * sinRotate
                y = point.y * cosRotate - point.x * sinRotate
                point.x = x;
                point.y = y
            } 
        })
        canvas.tank(tank)
    }

    const collisionBlockTank = (block: TPoint[]): boolean => {
        let collition: boolean
        let nearX = Math.max(block[0].x, Math.min(tankU.x, block[2].x));
        let nearY = Math.max(block[0].y, Math.min(tankU.y, block[2].y));
        const nearVector: TPoint = {x: nearX - tankU.x, y: nearY - tankU.y}
        let lengthVector = nearVector.x * nearVector.x + nearVector.y * nearVector.y
        if (lengthVector < tankU.r * tankU.r) {
            lengthVector = Math.sqrt(lengthVector)
            let direction = {x: nearVector.x/lengthVector, y: nearVector.y/lengthVector}
            let overlap = tankU.r - lengthVector
            if (overlap == tankU.r) overlap = 0
            WIN.left -= overlap * direction.x
            WIN.bottom -= overlap * direction.y
            return collition = true
            }
        return collition = false
    }

    const collisionBlockDeadTank = (block: TPoint[]): boolean => {
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

    const collisionCircleTank = (circle: TUnit): boolean => {
        let collition: boolean
        const nearVector: TPoint = {x: circle.x - tankU.x, y: circle.y - tankU.y}
        let lengthVector = Math.sqrt(nearVector.x * nearVector.x + nearVector.y * nearVector.y)
        let direction = {x: nearVector.x/lengthVector, y: nearVector.y/lengthVector}
        let overlap = tankU.r + circle.r - lengthVector
        if (overlap == tankU.r) overlap = 0
        if (overlap > 0) {
            WIN.left -= overlap * direction.x
            WIN.bottom -= overlap * direction.y
            return collition = true
        } 
        return collition = false
    }

    const collisionCircleDeadTank = (circle: TUnit): boolean => {
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

    const collisionTankDeadTank = (circle: TUnit): boolean => {
        let collition: boolean
        const nearVector: TPoint = {x: circle.x - tankU.x, y: circle.y - tankU.y}
        let lengthVector = Math.sqrt(nearVector.x * nearVector.x + nearVector.y * nearVector.y)
        let direction = {x: nearVector.x/lengthVector, y: nearVector.y/lengthVector}
        let overlap = 0.5 * (tankU.r + circle.r - lengthVector)
        if (overlap == tankU.r) overlap = 0
        if (overlap > 0) {
            WIN.left -=  overlap * direction.x
            WIN.bottom -= overlap * direction.y
            circle.x += overlap * direction.x
            circle.y += overlap * direction.y
            return collition = true
        } 
        return collition = false
    }

    const checkAllBlocksTank = () => {
        let flagCollision = false
        blocksArray.forEach((block) => {
            if ((block[0].x >= Math.floor(tankU.x - 2) && block[2].x <= Math.ceil(tankU.x + 2) && block[0].y <=  Math.ceil(tankU.y)  && block[2].y >= Math.floor(tankU.y)) || 
            (block[0].y >= Math.floor(tankU.y - 2) && block[2].y <=  Math.ceil(tankU.y + 2) && block[0].x <= Math.ceil(tankU.x) && block[2].x >= Math.floor(tankU.x))) {
                flagCollision = collisionBlockTank(block) || flagCollision
                collisionBlockDeadTank(block)
            }
        })

        circleArray.forEach((circle) => {
            flagCollision = collisionCircleTank(circle) || flagCollision
            collisionCircleDeadTank(circle)
        })

        collition = flagCollision
    }


    const renderScene = (FPS: number) => {
        if (canvas) {
            setShowFPS(FPS);
            canvas.clear();

            canvas.grid()

            canvas.block(blocksArray[0], '#585')
            canvas.block(blocksArray[1], '#585')
            canvas.block(blocksArray[2], '#585')
            canvas.block(blocksArray[3], '#585')
            canvas.block(blocksArray[4], '#585')
            canvas.block(blocksArray[5], '#585')
            canvas.block(blocksArray[6], '#585')
            canvas.block(blocksArray[7], '#585')

            canvas.circle(circleArray[0], '#666')
            canvas.circle(circleArray[1], '#666')
            canvas.circle(circleArray[2], '#666')
            canvas.circle(deadTank, '#333')

           
            moveSceneTank(keyPressed)
            checkAllBlocksTank()
            collisionTankDeadTank(deadTank)
            turnTanks(keyPressed)
        }
    }

    return(
        <div className="game_page">
            <canvas id="canvas"></canvas>
            <span className="fps">FPS: {FPS}</span>
        </div>
       
    )    
}

export default TankGamePage;