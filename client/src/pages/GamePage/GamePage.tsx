import React from "react";
import Canvas, { ICanvasOption } from "../../modules/Graph/Canvas/Canvas";
import { useEffect, useState } from "react";
import "./GamePage.css"
import {TKeyboard, TPoint } from "../../modules/types/types";
import useCanvas from "../../modules/Graph/Canvas/useCanvas";
import { type } from "os";


type TCheckBorder = {
    up: boolean, 
    down: boolean, 
    right?: boolean, 
    left?: boolean
}

type TUnit = TPoint & {
    r: number
}

const GamePage: React.FC = () => {

    const height = window.innerHeight - 26;
    const width = window.innerWidth - 26;
    const prop = width / height;
    const WIN = {
        left: -10 * prop,
        bottom: -10,
        width: 20 * prop,
        height: 20,
    };

    let canvas: Canvas
    const Canvas = useCanvas((FPS) => renderScene(FPS))

    const [FPS, setShowFPS] = useState<number>(0)

    const keyPressed: TKeyboard = {}

    let angleOfMovement = Math.PI/2;
    const speedRotate = Math.PI/256;
    const speedTank = 1/16;
    
    const speedInfantry = 1/16;

    const borderScena: TPoint[] = [{x: 10, y: 20}, {x: -10, y: 20}, {x: -10, y: -20}, {x: 10, y: -20}] 

    const tank: TPoint[] = [{x:-0.5, y:-0.7}, {x:0.5, y:-0.7}, {x:0.5, y:0.7}, {x:-0.5, y:0.7}] 
    const man: TUnit = {x: 0, y: 0, r: 30} 

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


    const keyDown = (event: KeyboardEvent) => {
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

    const keyUp = (event: KeyboardEvent) => {
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
    const moveSceneTank = (keyPressed: TKeyboard, canMove:TCheckBorder) => {
        const vectorTank: TPoint = {x: 1, y: 0}

        vectorTank.x = Math.sin(angleOfMovement) * speedTank;
        vectorTank.y = Math.cos(angleOfMovement) * speedTank;
        if(keyPressed.ArrowUp && canMove.up) {
            WIN.bottom += vectorTank.x
            WIN.left += vectorTank.y
        } 
        if(keyPressed.ArrowDown && canMove.down) {
            WIN.bottom -= vectorTank.x
            WIN.left -= vectorTank.y
        }

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

    const checkBorderTank = ():TCheckBorder => {
        let canMove = {up: true, down: true}
        for(let i = 0; i < tank.length; i++) {
            let point = tank[i]
            if (canvas.notxs(point.x) >= canvas.xs(borderScena[0].x) || canvas.notxs(point.x) <= canvas.xs(borderScena[2].x) ||
                canvas.notys(point.y) <= canvas.ys(borderScena[0].y) || canvas.notys(point.y) >= canvas.ys(borderScena[2].y)) {
                    (i==0 || i==1) ? canMove.down = false : canMove.up = false 
            }
        }    
        return canMove 
    }

    const renderScene = (FPS: number) => {
        if (canvas) {
            setShowFPS(FPS);
            
            canvas.clear();

            canvas.border(borderScena, '#777', "red")

            canvas.line(-100, -100, 100, 100, 2,'#66a')
            canvas.line(-100, 100, 100, -100, 2,'#66a')
            canvas.line(-100, 0, 100, 0, 2,'#66a')
            canvas.line(0, 100, 0, -100, 2,'#66a')
            
            moveSceneTank(keyPressed, checkBorderTank())
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