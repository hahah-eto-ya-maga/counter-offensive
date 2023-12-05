import React from "react";
import Canvas, { ICanvasOption } from "./Canvas/Canvas";
import MathGame from "./Math/MathGame";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {TKeyboard, TPoint, TUnit, TCheckBorder } from "../../../modules/types/types";
import useCanvas from "./hooks/useCanvas";
import Collision from "./Collision/Collision";
import useSprites from "./hooks/useSprites";
import "./GameCanvas.css"

const GameCanvas: React.FC = () => {

    
    const height = 2 * Math.round(window.innerHeight / 2);
    const width = 2 * Math.round(window.innerWidth / 2);
    const prop = width / height;

    let canvas: Canvas
    const Canvas = useCanvas((FPS) => renderScene(FPS))

    const location = useLocation()
    let unit = location.state.userRole

    const [FPS, setShowFPS] = useState<number>(0)

    const keyPressed: TKeyboard = {}

    const tank: TUnit = {x: 5, y: 4, r:0.5}
    const tankProp: TPoint = {x: 1.1*tank.r, y: 1.2*tank.r}

    const towerProp: TPoint = {x: 1.5*tank.r, y: 0.8*tank.r}

    const man: TUnit = {x: 6, y: 3, r: 0.16}
    const manProp: TPoint = {x: 1.4*man.r, y: man.r}

    const WIN = {
        left: -5 * prop + man.x,
        bottom: -5 + man.y,
        width: 10 * prop,
        height: 10,
    };

    const SPRITE_SIZE = width / WIN.width
    const SIZE = height / WIN.height  

    const math = new MathGame({WIN})
    let angleOfMovement = Math.PI/2;
    const speedRotate = Math.PI/256;
    const speedTank = 1/16;
    let speedTankNow = speedTank;
    const vectorTank: TPoint = {x: 0, y: 1}
    
    const speedInfantry = 1/18;
    let speedInfantryNow = speedInfantry

    const blocksArray: TPoint[][] = [[{x:4, y: 6}, {x:4, y: 8}, {x:8, y: 8}, {x:8, y: 6}],  
        [{x:-1, y: -1}, {x:-1, y: 61}, {x:0, y: 61}, {x:0, y: -1}], [{x:0, y: -1}, {x:0, y: 0}, {x:75, y: 0}, {x:75, y: -1}],    //граница
        [{x:75, y: -1}, {x:75, y: 61}, {x:76, y: 61}, {x:76, y: -1}], [{x:0, y: 60}, {x:0, y: 61}, {x:75, y: 61}, {x:75, y: 60}]]
    const circlesArray: TUnit[] = [{x: 8, y: 6, r: 0.4}, {x: 9, y: 5, r: 0.4}, {x: 3.5, y: 6.5, r: 0.4}]
    const deadTank: TUnit = {x: 7.5, y: 3, r: 0.5}
    
    let isCollition: boolean = false

    const collision = new Collision({WIN, blocksArray, circlesArray})

    let cursorPosition: TPoint = {x:0, y:0}

    useEffect(() => {
        canvas = Canvas({
            id: 'canvas',
            width: width,
            height: height,
            WIN: WIN,
            callbacks: {
                keydown: (event) => {keyDown(event)},
                keyup: (event) => {keyUp(event)},
                mousemove: (event) => {mouseMove(event)},
            }
        });

      return () => {
         canvas.clearRect();
      };
   }, []);

   const keyDown = (event: KeyboardEvent): void => {
      if (event.code === "ArrowUp" || event.code === "KeyW") {
         keyPressed.ArrowUp = true;
      }
      if (event.code === "ArrowDown" || event.code === "KeyS") {
         keyPressed.ArrowDown = true;
      }
      if (event.code === "ArrowRight" || event.code === "KeyD") {
         keyPressed.ArrowRight = true;
      }
      if (event.code === "ArrowLeft" || event.code === "KeyA") {
         keyPressed.ArrowLeft = true;
      }
   };

   const keyUp = (event: KeyboardEvent): void => {
      if (event.code === "ArrowUp" || event.code === "KeyW") {
         keyPressed.ArrowUp = false;
      }
      if (event.code === "ArrowDown" || event.code === "KeyS") {
         keyPressed.ArrowDown = false;
      }
      if (event.code === "ArrowRight" || event.code === "KeyD") {
         keyPressed.ArrowRight = false;
      }
      if (event.code === "ArrowLeft" || event.code === "KeyA") {
         keyPressed.ArrowLeft = false;
      }
   };

   const mouseMove = (event: MouseEvent): void => {
      cursorPosition.x = event.pageX;
      cursorPosition.y = event.pageY;
   };

   const mouseUp = (event: MouseEvent): void => {

   }

   const mouseDown = (event: MouseEvent): void => {

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
        
        man.x = WIN.left + 5 * prop;
        man.y = WIN.bottom + 5
    }

    /* движение танка по карте*/
    const moveSceneTank = (keyPressed: TKeyboard) => {
        isCollition ? speedTankNow = speedTank / 3 : speedTankNow = speedTank 
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

      tank.x = WIN.left + 5 * prop;
      tank.y = WIN.bottom + 5;

      if (keyPressed.ArrowLeft && keyPressed.ArrowDown) {
         angleOfMovement -= speedRotate;
      } else if (keyPressed.ArrowLeft) {
         angleOfMovement += speedRotate;
      }

      if (keyPressed.ArrowRight && keyPressed.ArrowDown) {
         angleOfMovement += speedRotate;
      } else if (keyPressed.ArrowRight) {
         angleOfMovement -= speedRotate;
      }
   };
    
   const [
        img,
        grass, 
        home, 
        stone, 
        bullet, 
        tank2,
        tank3,
        manAutomat,
        manRPG, 
        boom
      ] = useSprites(SPRITE_SIZE, SIZE)

   const rotateGun = (unit: string) => {
      let vector: TPoint = {x:1,y:0}
      vector.x = canvas.pxToX(cursorPosition.x)
      vector.y = canvas.pxToY(cursorPosition.y)
      const toAngle = Math.atan2(vector.y, vector.x)
      canvas.trace(vectorTank, toAngle, 60, blocksArray, circlesArray)
      if (unit === 'RPG') {
         canvas.spriteDir(img, man.x-0.5, man.y + 0.5, manRPG[0], manRPG[1], manRPG[2], manRPG[3], -toAngle + Math.PI/2)
      } else {
         canvas.spriteDir(img, man.x-0.5, man.y + 0.5, manAutomat[0], manAutomat[1], manAutomat[2], manAutomat[3], -toAngle + Math.PI/2)
      }
   }


   const renderScene = (FPS: number) => {
      let fpsGap = 0.5
      if (canvas) {
         canvas.clearRect();
            setShowFPS(FPS)

            canvas.grid()

            canvas.spriteMap(img, 0, 5, grass[0], grass[1], grass[2], grass[3])
            canvas.spriteMap(img, 5, 5, grass[0], grass[1], grass[2], grass[3])
            canvas.spriteMap(img, 5, 10, grass[0], grass[1], grass[2], grass[3])
            canvas.spriteMap(img, 0, 10, grass[0], grass[1], grass[2], grass[3])

            blocksArray.forEach(block => {
               canvas.spriteMap(img, block[1].x, block[1].y, home[0], home[1], home[2], home[3])
            })

            circlesArray.forEach(circle => {
               canvas.spriteMap(img, circle.x - 0.5, circle.y + 0.5, stone[0], stone[1], stone[2], stone[3])
            })

           
            if (unit === 'Tank2') {
                moveSceneTank(keyPressed) 
                canvas.trace(vectorTank, angleOfMovement, 60, blocksArray, circlesArray)
                canvas.spriteDir(img, tank.x-0.52, tank.y+0.6, tank2[0], tank2[1], tank2[2], tank2[3], -angleOfMovement)
                isCollition = collision.checkAllBlocksUnit(tank, deadTank, isCollition, true)
                 
            } 
            if (unit === 'Tank3') {
               moveSceneTank(keyPressed) 
               canvas.trace(vectorTank, angleOfMovement, 60, blocksArray, circlesArray)
               canvas.spriteDir(img, tank.x-0.6, tank.y+0.6, tank3[0], tank3[1], tank3[2], tank3[3], -angleOfMovement)
               isCollition = collision.checkAllBlocksUnit(tank, deadTank, isCollition, true)
                
           } 
            if (unit === 'RPG' || unit === "Automat") {
               moveSceneInfantry(keyPressed)
               rotateGun(unit)
              
               isCollition = collision.checkAllBlocksUnit(man, deadTank, isCollition)
               
            }
            // canvas.trace(vectorTank, angleOfMovement, 60, blocksArray, circlesArray)
            canvas.render()
           
            canvas.printText(
               `FPS: ${FPS}`,
               WIN.left + fpsGap,
               WIN.bottom + WIN.height - fpsGap,
               "white",
               20
            );
        }
    }


    return(
         <canvas id="canvas"></canvas>
    )
}

export default GameCanvas