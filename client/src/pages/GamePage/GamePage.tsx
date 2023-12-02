import React from "react";
import Canvas, { ICanvasOption } from "../../modules/Graph/Canvas/Canvas";
import MathGame from "../../modules/Graph/Math/MathGame";
import { useEffect, useState } from "react";
import {
   TKeyboard,
   TPoint,
   TUnit,
   TCheckBorder,
   TWIN,
} from "../../modules/types/types";
import useCanvas from "../../modules/Graph/Canvas/useCanvas";
import Collision from "../../modules/Graph/Collision/Collison";
import { manAutomat, corpusTank, towerTank } from "../../assets/svgs";
import { grass, house, stone } from "../../assets/pngs";
import GameCanvas from "../../modules/Graph/GameCanvas/GameCanvas";
import "./GamePage.css";

interface IGamePageProps {
   unit: string;
}

const GamePage: React.FC<IGamePageProps> = ({ unit }) => {
   const height = window.innerHeight - 26;
   const width = window.innerWidth - 26;

   const prop = width / height;

   let canvas: Canvas | null = null;
   const Canvas = useCanvas((FPS) => renderScene(FPS));

   const keyPressed: TKeyboard = {};

   const tank = { x: 5, y: 4, r: 0.5 };
   const tankProp: TPoint = { x: 1.1 * tank.r, y: 1.2 * tank.r };

   const towerProp: TPoint = { x: 1.5 * tank.r, y: 0.8 * tank.r };

   const man = { x: 6, y: 3, r: 0.16 };
   const manProp: TPoint = { x: 1.4 * man.r, y: man.r };

   const WIN: TWIN = {
      LEFT: -8 * prop + man.x,
      BOTTOM: -8 + man.y,
      WIDTH: 16 * prop,
      HEIGHT: 16,
   };

   const corpusTankImage = new Image();
   corpusTankImage.src = corpusTank;

   const towerTankImage = new Image();
   towerTankImage.src = towerTank;

   const manImage = new Image();
   manImage.src = manAutomat;

   const houseImage = new Image();
   houseImage.src = house;

   const grassImage = new Image();
   grassImage.src = grass;

   const stoneImage = new Image();
   stoneImage.src = stone;

   const math = new MathGame({ WIN });

   let angleOfMovement = Math.PI / 2;
   const speedRotate = Math.PI / 256;
   const speedTank = 1 / 16 ;
   let speedTankNow = speedTank;
   const vectorTank: TPoint = { x: 0, y: 1 };

   const speedInfantry = 1 / 18;
   let speedInfantryNow = speedInfantry;

   const blocksArray: TPoint[][] = [
      [
         { x: 4, y: 6.5 },
         { x: 4, y: 8 },
         { x: 7, y: 8 },
         { x: 7, y: 6.5 },
      ],
      [
         { x: 4, y: 9 },
         { x: 4, y: 10 },
         { x: 5, y: 10 },
         { x: 5, y: 9 },
      ],
      [
         { x: 6, y: 9 },
         { x: 6, y: 10 },
         { x: 7, y: 10 },
         { x: 7, y: 9 },
      ],
      [
         { x: -1, y: -1 },
         { x: -1, y: 61 },
         { x: 0, y: 61 },
         { x: 0, y: -1 },
      ],
      [
         { x: 0, y: -1 },
         { x: 0, y: 0 },
         { x: 75, y: 0 },
         { x: 75, y: -1 },
      ],
      [
         { x: 75, y: -1 },
         { x: 75, y: 61 },
         { x: 76, y: 61 },
         { x: 76, y: -1 },
      ],
      [
         { x: 0, y: 60 },
         { x: 0, y: 61 },
         { x: 75, y: 61 },
         { x: 75, y: 60 },
      ],
   ];
   const circlesArray = [
      { x: 8, y: 6, r: 0.5 },
      { x: 9, y: 5, r: 0.3 },
      { x: 3.5, y: 6.5, r: 0.2 },
   ];
   const deadTank = { x: 7.5, y: 3, r: 0.5 };

   let isCollition: boolean = false;

   const collision = new Collision({ WIN, blocksArray, circlesArray });

   let cursorPosition: TPoint = { x: 0, y: 0 };

   let gameCanvas: GameCanvas;

   useEffect(() => {
      canvas = Canvas({
         id: "canvas",
         width: width,
         height: height,
         WIN: WIN,
         callbacks: {
            keydown: (event) => {
               keyDown(event);
            },
            keyup: (event) => {
               keyUp(event);
            },
            mousemove: (event) => {
               mouseMove(event);
            },
            mouseup: (event) => {
               mouseUp(event);
            },
            mousedown: (event) => {
               mouseDown(event);
            },
         },
      });

      gameCanvas = new GameCanvas({ canvas, WIN });

      return () => {
         canvas = null;
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
      cursorPosition.x = event.pageX - 13;
      cursorPosition.y = event.pageY - 13;
   };

   const mouseUp = (event: MouseEvent): void => {

   }

   const mouseDown = (event: MouseEvent): void => {

   }

   /* движение пехотинца по карте */
   const moveSceneInfantry = (keyPressed: TKeyboard) => {
      const diagonalSpeed = (speedInfantry * Math.sqrt(2)) / 2;
      if (
         (keyPressed.ArrowUp && keyPressed.ArrowLeft) ||
         (keyPressed.ArrowUp && keyPressed.ArrowRight) ||
         (keyPressed.ArrowDown && keyPressed.ArrowRight) ||
         (keyPressed.ArrowDown && keyPressed.ArrowLeft)
      )
         speedInfantryNow = diagonalSpeed;
      else speedInfantryNow = speedInfantry;

      if (keyPressed.ArrowUp) {
         WIN.BOTTOM += speedInfantryNow;
      }
      if (keyPressed.ArrowDown) {
         WIN.BOTTOM -= speedInfantryNow;
      }
      if (keyPressed.ArrowLeft) {
         WIN.LEFT -= speedInfantryNow;
      }
      if (keyPressed.ArrowRight) {
         WIN.LEFT += speedInfantryNow;
      }

      man.x = WIN.LEFT + 8 * prop;
      man.y = WIN.BOTTOM + 8;
   };

   /* движение танка по карте*/
   const moveSceneTank = (keyPressed: TKeyboard, FPS: number) => {
      isCollition ? (speedTankNow = speedTank / 3) : (speedTankNow = speedTank);
      vectorTank.x = Math.cos(angleOfMovement) * speedTankNow;
      vectorTank.y = Math.sin(angleOfMovement) * speedTankNow;
      if (keyPressed.ArrowUp) {
         WIN.BOTTOM += vectorTank.y;
         WIN.LEFT += vectorTank.x;
      }
      if (keyPressed.ArrowDown) {
         WIN.BOTTOM -= vectorTank.y;
         WIN.LEFT -= vectorTank.x;
      }

      tank.x = WIN.LEFT + 8 * prop;
      tank.y = WIN.BOTTOM + 8;

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

   /* const rotateGun = () => {
      let vector: TPoint = { x: 1, y: 0 };
      if (canvas) {
         vector.x = canvas.pxToX(cursorPosition.x);
         vector.y = canvas.pxToY(cursorPosition.y);

         vector = math.normalizeVector(vector);

         const toAngle = Math.atan2(vector.y, vector.x);

         canvas.rayTracing(vector, toAngle, 60);
         canvas.rotateMan(manImage, manProp, toAngle);
         canvas.point(cursorPosition.x, cursorPosition.y, "red", 4);
      }
   }; */

   const renderScene = (FPS: number) => {
      if (canvas) {
         const fpsGap = 0.5;
         canvas.clear();

         // canvas.drawGrass(grassImage, [{x:0, y:0}, {x:0, y:12}, {x:12, y:12}, {x:12, y:0}])

         canvas.polygon(blocksArray[0], "#ff0000");
         canvas.polygon(blocksArray[1], "#ff0000");
         canvas.polygon(blocksArray[2], "#ff0000");

         canvas.polygon(blocksArray[3], "#ff0000");
         canvas.polygon(blocksArray[4], "#ff0000");
         canvas.polygon(blocksArray[5], "#ff0000");
         canvas.polygon(blocksArray[6], "#ff0000");

         canvas.circle(deadTank, "#333");

         canvas.circle(circlesArray[0], "#ff0000");
         canvas.circle(circlesArray[1], "#ff0000");
         canvas.circle(circlesArray[2], "#ff0000");

         // canvas.drawStone(stoneImage, circlesArray[0], Math.PI)
         // canvas.drawStone(stoneImage, circlesArray[1], Math.PI / 2)
         // canvas.drawStone(stoneImage, circlesArray[2], 0)

         // canvas.drawHouse(houseImage, blocksArray[0])
         // canvas.drawHouse(houseImage, blocksArray[1])
         // canvas.drawHouse(houseImage, blocksArray[2])

         if (unit === "Tank") {
           
            moveSceneTank(keyPressed, FPS);
            let vector = math.normalizeVector(vectorTank);

            canvas.rayTracing(vector, angleOfMovement, 45);
            canvas.circle(tank, 'blue')
           
            // new Driver({keyPreesed: keyPressed, WIN: WIN, speed: speedTank, speedRotate: speedRotate, image: corpusTank, unit: tank})
            // driver.moveSceneTank(keyPressed)
            isCollition = collision.checkAllBlocksUnit(
               tank,
               deadTank,
               isCollition,
               true
            );
           
            // canvas.rotateTank(corpusTankImage, tankProp, angleOfMovement);
            // canvas.rotateTower(towerTankImage, towerProp, angleOfMovement);
         }
         if (unit === "Infantry") {
           
            moveSceneInfantry(keyPressed);
          
            canvas.circle(man, 'blue')
           
            isCollition = collision.checkAllBlocksUnit(
               man,
               deadTank,
               isCollition
            );

             
           
            // rotateGun();
         }

         canvas.lineBrezen({x:0, y:1})

         canvas.circle({ ...man });
         canvas.printText(
            `FPS: ${FPS}`,
            WIN.LEFT + fpsGap,
            WIN.BOTTOM + WIN.HEIGHT - fpsGap,
            "white",
            20
         );

         canvas.render();
      }
   };

   return (
      <div className="game_page">
         <canvas id="canvas"></canvas>
      </div>
   );
};
export default GamePage;
