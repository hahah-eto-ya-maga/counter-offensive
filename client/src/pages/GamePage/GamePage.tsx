import React from "react";
import Canvas, { ICanvasOption } from "../../modules/Graph/Canvas/Canvas";
import MathGame from "../../modules/Graph/Math/MathGame";
import { useEffect, useState } from "react";
import {TKeyboard, TPoint, TUnit, TCheckBorder } from "../../modules/types/types";
import useCanvas from "../../modules/Graph/Canvas/useCanvas";
import "./GamePage.css"
import Collision from "../../modules/Graph/Collision/Collison";

const GamePage: React.FC = () => {

    const height = window.innerHeight - 26;
    const width = window.innerWidth - 26;
    const prop = width / height;

    let canvas: Canvas
    const Canvas = useCanvas((FPS) => renderScene(FPS))

    const [FPS, setShowFPS] = useState<number>(0)

    const keyPressed: TKeyboard = {}

    const man: TUnit = {x: 6, y: 3, r: 0.2}
    const tank: TUnit = {x: 5, y: 4, r:0.4}
    const tankI: TPoint[] = [{x:-0.4, y:- 0.4}, {x:-0.4, y: 0.4}, {x:0.4, y: 0.4}, {x:0.4, y: -0.4}] 

    const WIN = {
        left: -8 * prop + tank.x,
        bottom: -8 + tank.y,
        width: 16 * prop,
        height: 16,
    };

    const math = new MathGame({WIN})
    let angleOfMovement = Math.PI/2;
    const speedRotate = Math.PI/256;
    const speedTank = 1/16;
    let speedTankNow = speedTank;
    const vectorTank: TPoint = {x: 0, y: 1}
    
    const speedInfantry = 1/18;
    let speedInfantryNow = speedInfantry

    const blocksArray: TPoint[][] = [[{x:5, y: 6}, {x:5, y: 8}, {x:7, y: 8}, {x:7, y: 6}], [{x:6, y: 9}, {x:6, y: 10}, {x:7, y: 10}, {x:7, y: 9}], 
        [{x:8, y: 9}, {x:8, y: 10}, {x:9, y: 10}, {x:9, y: 9}], [{x:6, y: 8.5}, {x:6, y: 9}, {x:11, y: 9}, {x:11, y: 8.5}],
        [{x:-1, y: -1}, {x:-1, y: 61}, {x:0, y: 61}, {x:0, y: -1}], [{x:0, y: -1}, {x:0, y: 0}, {x:75, y: 0}, {x:75, y: -1}],
        [{x:75, y: -1}, {x:75, y: 61}, {x:76, y: 61}, {x:76, y: -1}], [{x:0, y: 60}, {x:0, y: 61}, {x:75, y: 61}, {x:75, y: 60}],]
    const circlesArray: TUnit[] = [{x: 8, y: 6, r: 0.5}, {x: 9, y: 5, r: 0.3}, {x: 3.5, y: 6.5, r: 0.2}]
    const deadTank: TUnit = {x: 7.5, y: 3, r: 0.4}
    
    let isCollition: boolean = false

    const collision = new Collision({WIN, blocksArray, circlesArray})

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

    /* движение пехотинца по карте */
    const moveSceneInfantry = (keyPressed: TKeyboard) => {
        const diagonalSpeed = speedInfantry * Math.sqrt(2) / 2;
        if (keyPressed.ArrowUp && keyPressed.ArrowLeft || keyPressed.ArrowUp && keyPressed.ArrowRight ||
             keyPressed.ArrowDown && keyPressed.ArrowRight || keyPressed.ArrowDown && keyPressed.ArrowLeft) speedInfantryNow = diagonalSpeed 
        else speedInfantryNow = speedInfantry  
        
        if(keyPressed.ArrowUp) {
            WIN.bottom += speedInfantryNow;
        } 
        if(keyPressed.ArrowDown) {
            WIN.bottom -= speedInfantryNow;
        }
        if (keyPressed.ArrowLeft) {
            WIN.left -= speedInfantryNow;
        }
        if (keyPressed.ArrowRight) {
            WIN.left += speedInfantryNow;
        } 
        
        man.x = WIN.left + 8 * prop;
        man.y = WIN.bottom + 8

        canvas.man(man.r, 'yellow')

    }

    /* движение танка по карте*/
    const moveSceneTank = (keyPressed: TKeyboard) => {
        isCollition ? speedTankNow = speedTank / 2 : speedTankNow = speedTank 
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

        tank.x = WIN.left + 8 * prop;
        tank.y = WIN.bottom + 8

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
        tankI.forEach(point => {
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
        canvas.tank(tankI)
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

            canvas.circle(circlesArray[0], '#666')
            canvas.circle(circlesArray[1], '#666')
            canvas.circle(circlesArray[2], '#666')
            canvas.circle(deadTank, '#333')

           
            moveSceneTank(keyPressed)
            isCollition = collision.checkAllBlocksUnit(tank, deadTank, isCollition, true)
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