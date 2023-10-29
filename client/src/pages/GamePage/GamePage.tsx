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
        left: -8 * prop + man.x,
        bottom: -8 + man.y,
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

    const checkBlockInfantry = (block: TPoint[]) => {
        let nearX = Math.max(block[0].x, Math.min(man.x, block[2].x));
        let nearY = Math.max(block[0].y, Math.min(man.y, block[2].y));
        const nearVector: TPoint = {x: nearX - man.x, y: nearY - man.y}
        let lengthVector = Math.sqrt(nearVector.x * nearVector.x + nearVector.y * nearVector.y)
        let overlap = man.r - lengthVector
        if (overlap > 0) {
            WIN.left = WIN.left - nearVector.x / lengthVector * speedInfantryNow
            WIN.bottom = WIN.bottom - nearVector.y / lengthVector * speedInfantryNow
        }
    }

    const checkAllBlocksInfantry = () => {
        blocksArray.forEach((block, i) => {
            if (block[0].x >= Math.floor(man.x - 1) && block[0].y >= Math.floor(man.y - 1) && block[2].x <= Math.ceil(man.x + 1) && block[2].y <=  Math.ceil(man.y + 1)) {
                checkBlockInfantry(block)
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

           
            // moveSceneTank(keyPressed)
            // checkAllBlocksTank()
            // turnTanks(keyPressed)
            checkAllBlocksInfantry()
            moveSceneInfantry(keyPressed)
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