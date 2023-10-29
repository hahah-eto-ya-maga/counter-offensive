import React from "react";
import Canvas, { ICanvasOption } from "../../modules/Graph/Canvas/Canvas";
import MathGame from "../../modules/Graph/Math/MathGame";
import { useEffect, useState } from "react";
import {TKeyboard, TPoint, TUnit, TCheckBorder } from "../../modules/types/types";
import useCanvas from "../../modules/Graph/Canvas/useCanvas";
import "./GamePage.css"



const GamePage: React.FC = () => {

    const height = window.innerHeight - 26;
    const width = window.innerWidth - 26;
    const prop = width / height;

    let canvas: Canvas
    const Canvas = useCanvas((FPS) => renderScene(FPS))

    const [FPS, setShowFPS] = useState<number>(0)

    const keyPressed: TKeyboard = {}

    let angleOfMovement = Math.PI/2;
    const speedRotate = Math.PI/256;
    const speedTank = 1/16;
    let speedTankNow = speedTank;
    const vectorTank: TPoint = {x: 0, y: 1}
    
    const speedInfantry = 1/16;
    let speedInfantryNow = speedInfantry

    const borderScena: TPoint[] = [{x: 0, y: 0}, {x: 75, y: 0}, {x: 75, y: 60}, {x: 0, y: 60}] 
    const blocksArray: TPoint[][] = [[{x:6, y: 6}, {x:6, y: 7}, {x:7, y: 7}, {x:7, y: 6}], [{x:6, y: 9}, {x:6, y: 10}, {x:7, y: 10}, {x:7, y: 9}], 
        [{x:8, y: 9}, {x:8, y: 10}, {x:9, y: 10}, {x:9, y: 9}], [{x:7, y: 8}, {x:7, y: 9}, {x:8, y: 9}, {x:8, y: 8}]]

    const man: TUnit = {x: 7, y: 3, r: 0.3}
    const tankU: TUnit = {x: 4, y: 5, r:0.4}
    const tank: TPoint[] = [{x:-0.4, y:- 0.4}, {x:-0.4, y: 0.4}, {x:0.4, y: 0.4}, {x:0.4, y: -0.4}] 

    let collition: boolean = false

    const WIN = {
        left: -8 * prop + tankU.x,
        bottom: -8 + tankU.y,
        width: 16 * prop,
        height: 16,
    };

    const math = new MathGame({WIN})

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
        collition ? speedTankNow = speedTank / 6 : speedTankNow = speedTank 
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

    const checkBlockTank = (block: TPoint[]) => {
        let nearX = Math.max(block[0].x, Math.min(tankU.x, block[2].x));
        let nearY = Math.max(block[0].y, Math.min(tankU.y, block[2].y));
        const nearVector: TPoint = {x: nearX - tankU.x, y: nearY - tankU.y}
        let lengthVector = Math.sqrt(nearVector.x * nearVector.x + nearVector.y * nearVector.y)
        let overlap = tankU.r - lengthVector
        if (overlap > 0) {
            collition = true
            WIN.left = WIN.left - nearVector.x / lengthVector * Math.abs(vectorTank.x)
            WIN.bottom = WIN.bottom - nearVector.y / lengthVector * Math.abs(vectorTank.y)
        } else collition = false
    }

    const checkAllBlocksTank = () => {
        blocksArray.forEach((block, i) => {
            if (block[0].x >= Math.floor(tankU.x - 1) && block[0].y >= Math.floor(tankU.y - 1) && block[2].x <= Math.ceil(tankU.x + 1) && block[2].y <=  Math.ceil(tankU.y + 1)) {
                return checkBlockTank(block)
            }
        })
    }


    const renderScene = (FPS: number) => {
        if (canvas) {
            setShowFPS(FPS);
            canvas.clear();

            canvas.border(borderScena, '#777', "red")
            canvas.block(blocksArray[0], 'green')
            canvas.block(blocksArray[1], 'green')
            canvas.block(blocksArray[2], 'green')
            canvas.block(blocksArray[3], 'green')

            canvas.grid()

           
            moveSceneTank(keyPressed)
            checkAllBlocksTank()
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

export default GamePage;