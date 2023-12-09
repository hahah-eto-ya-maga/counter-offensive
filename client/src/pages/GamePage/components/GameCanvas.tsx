import React from "react";
import Canvas from "./Canvas/Canvas";
import MathGame from "./Math/MathGame";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {TKeyboard, TPoint, TUnit, TScena } from "../types/types";
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
    let role = location.state.userRole

    const [FPS, setShowFPS] = useState<number>(0)

    const keyPressed: TKeyboard = {}

    let unit: TUnit = {x: 5, y: 6, r:0.5}

    const WIN = {
        left: -5 * prop + unit.x,
        bottom: -5 + unit.y,
        width: 10 * prop,
        height: 10,
    };

    const SPRITE_SIZE = width / WIN.width 
    const SIZE = 97

    const math = new MathGame({WIN})
    let angleOfMovement = Math.PI/2;
    const speedRotate = Math.PI/256;
    const speedTank = 1/16;
    let speedTankNow = speedTank;
    const vectorTank: TPoint = {x: 0, y: 1}
    
    const speedInfantry = 1/18;
    let speedInfantryNow = speedInfantry


    const scena: TScena = {
      homes:  [[{x:4, y: 6.5}, {x:4, y: 8}, {x:7, y: 8}, {x:7, y: 6.5}],],
      walls: [[{x:-1, y: -1}, {x:-1, y: 61}, {x:0, y: 61}, {x:0, y: -1}], [{x:-1, y: -1}, {x:-1, y: 0}, {x:75, y: 0}, {x:75, y: -1}],    //граница
      [{x:75, y: -1}, {x:75, y: 61}, {x:76, y: 61}, {x:76, y: -1}], [{x:0, y: 60}, {x:0, y: 61}, {x:75, y: 61}, {x:75, y: 60}]],
      stones: [{x: 8, y: 6, r: 0.5}, {x: 9, y: 5, r: 0.5}, {x: 3, y: 6, r: 0.5}],
      bushes: []
    }

    const deadTank: TUnit = {x: 7.5, y: 3, r: 0.5}
    
    let isCollition: boolean = false

    const collision = new Collision({WIN, scena})

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
        
        unit.x = WIN.left + 5 * prop;
        unit.y = WIN.bottom + 5
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

      unit.x = WIN.left + 5 * prop;
      unit.y = WIN.bottom + 5;

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
    
   const {
        img: img,
        anim: [
         boom
         ],
        static: [
         grass, 
         home,
         wall, 
         stone, 
         bullet, 
         tank2,
         tank3,
         manAutomat,
         manRPG, 
         manFlag
      ],
    } = useSprites(SPRITE_SIZE, SIZE)

   const rotateGun = (): number => {
      let vector: TPoint = {x:1,y:0}
      vector.x = canvas.pxToX(cursorPosition.x)
      vector.y = canvas.pxToY(cursorPosition.y)
      const toAngle = Math.atan2(vector.y, vector.x)
      return toAngle
   }


   const renderScene = (FPS: number) => {
      let fpsGap = 0.5
      if (canvas) {
         canvas.clearRect();
            setShowFPS(FPS)

            canvas.grid()

            for(let i = scena.walls[0][1].x; i < scena.walls[2][3].x; i+=5) {
               for(let j = scena.walls[3][0].y; j > scena.walls[1][2].y; j-=5) {
                  canvas.spriteMap(img, i, j, grass[0], grass[1], grass[2], grass[3])
               }
            }
            scena.homes.forEach(block => {
               canvas.spriteMap(img, block[1].x, block[1].y, home[0], home[1], home[2], home[3])
            })

            scena.stones.forEach(circle => {
               canvas.spriteMap(img, circle.x - 0.5, circle.y + 0.5, stone[0], stone[1], stone[2], stone[3])
            })

            scena.walls.forEach(block => {
               for(let i = block[1].x; i < block[3].x; i++) {
                  for(let j = block[1].y; j > block[3].y; j--) {
                     canvas.spriteMap(img, i, j, wall[0], wall[1], wall[2], wall[3])
                  }
               }
            })
           
            if (role === 'Tank2') {
               unit = {x: 5, y: 4, r:0.54}
               canvas.drawSceneTrace(scena)
               canvas.trace(angleOfMovement, 60)

               moveSceneTank(keyPressed)
               canvas.spriteDir(img, unit.x - 1, unit.y + 1, tank2[0], tank2[1], tank2[2], tank2[3], -angleOfMovement)

               isCollition = collision.checkAllBlocksUnit(unit, deadTank, isCollition, true)
            } 
            if (role === 'Tank3') {
               unit = {x: 5, y: 4, r:0.61}
               canvas.drawSceneTrace(scena)
               canvas.trace(angleOfMovement, 60)

               moveSceneTank(keyPressed) 
               canvas.spriteDir(img, unit.x - 1, unit.y + 1, tank3[0], tank3[1], tank3[2], tank3[3], -angleOfMovement)

               isCollition = collision.checkAllBlocksUnit(unit, deadTank, isCollition, true)
           } 
            if (role === 'RPG') {
               unit = {x: 5, y: 4, r:0.2}
               canvas.drawSceneTrace(scena)
               let toAngle = rotateGun()
               canvas.trace(toAngle, 120)

               moveSceneInfantry(keyPressed)
               canvas.spriteDir(img, unit.x-0.5, unit.y + 0.5, manRPG[0], manRPG[1], manRPG[2], manRPG[3], - toAngle+ Math.PI/2)
        
               isCollition = collision.checkAllBlocksUnit(unit, deadTank, isCollition)
            }
            if (role === 'Automat') {
               unit = {x: 5, y: 4, r:0.2}
               canvas.drawSceneTrace(scena)
               let toAngle = rotateGun()
               canvas.trace(toAngle, 120)

               moveSceneInfantry(keyPressed)
               canvas.spriteDir(img, unit.x-0.5, unit.y + 0.5, manAutomat[0], manAutomat[1], manAutomat[2], manAutomat[3], - toAngle+ Math.PI/2)
        
               isCollition = collision.checkAllBlocksUnit(unit, deadTank, isCollition)       
            }
            if (role === 'Flag') {
               unit = {x: 5, y: 4, r:0.2}
               canvas.drawSceneTrace(scena)
               let toAngle = rotateGun()
               canvas.trace(toAngle, 120)

               moveSceneInfantry(keyPressed)
               canvas.spriteDir(img, unit.x-0.5, unit.y + 0.5, manFlag[0], manFlag[1], manFlag[2], manFlag[3], - toAngle+ Math.PI/2)
        
               isCollition = collision.checkAllBlocksUnit(unit, deadTank, isCollition)
            }
 
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