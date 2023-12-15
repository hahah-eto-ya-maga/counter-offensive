import { FC, useContext, useEffect } from "react";
import Game, { IGameScene, ISceneObjects } from "../Game/Game";
import { MediatorContext, ServerContext } from "../../App";
import useSprites from "../../pages/GamePage/components/hooks/useSprites";
import Canvas from "./Canvas/Canvas";
import useCanvas from "./Canvas/useCanvas";
import { TPoint } from "../../pages/GamePage/types";
import Unit from "../../pages/GamePage/components/Game/Units/Unit";
import Collision from "../../pages/GamePage/components/Collision/Collision";
import { MAP_SIZE } from "../../config";
import TraceMask from "./TraceMask";

export interface IPressedKeys {
   Up: boolean;
   Down: boolean;
   Right: boolean;
   Left: boolean;
}

interface GameCanvasProps {
   inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const GameCanvas: FC<GameCanvasProps> = ({ inputRef }) => {
   const server = useContext(ServerContext);
   const mediator = useContext(MediatorContext);

   const canvasId = "canvas";

   const unit = new Unit();

   const height = window.innerHeight;
   const width = window.innerWidth;
   const prop = width / height;
   const WIN = {
      left: -1,
      bottom: -1,
      width: 10 * prop,
      height: 10,
   };

   let tracer: TraceMask | null = null;
   let canvas: Canvas | null = null;
   const createCanvas = useCanvas(render);

   useEffect(() => {
      canvas = createCanvas({
         height,
         width,
         id: canvasId,
         WIN,
         callbacks: {
            keydown: keyDownHandler,
            keyup: keyUpHandler,
            mousemove: mouseMoveHandler,
         },
      });
      tracer = new TraceMask({
         WIN,
         canvas,
         width,
         height,
         cellSize:SPRITE_SIZE
      });
      return () => {
         canvas = null;
      };
   });

   const SPRITE_SIZE = width / WIN.width;
   const SIZE = 97;

   const [
      img,
      boom,
      middleTank,
      heavyTank,
      grass,
      stone,
      home,
      wall,
      bullet,
      manDead,
      manRPG,
      manAutomat,
      manFlag,
      corpusTank2,
      corpusTank3,
      towerTank2,
      towerTank3,
   ] = useSprites(SPRITE_SIZE, SIZE);

   const scene: IGameScene = {
      tanks: [],
      bullets: [],
      bots: [],
      gamers: [],
      objects: {
         houses: [
            [
               { x: 4, y: 6.5 },
               { x: 4, y: 8 },
               { x: 7, y: 8 },
               { x: 7, y: 6.5 },
            ],
         ],
         walls: [
            [
               { x: -1, y: -1 },
               { x: -1, y: MAP_SIZE.height + 1 },
               { x: 0, y: MAP_SIZE.height + 1 },
               { x: 0, y: -1 },
            ],
            [
               { x: -1, y: -1 },
               { x: -1, y: 0 },
               { x: MAP_SIZE.width, y: 0 },
               { x: MAP_SIZE.width, y: -1 },
            ],
            [
               { x: MAP_SIZE.width, y: -1 },
               { x: MAP_SIZE.width, y: MAP_SIZE.height + 1 },
               { x: MAP_SIZE.width + 1, y: MAP_SIZE.height + 1 },
               { x: MAP_SIZE.width + 1, y: -1 },
            ],
            [
               { x: 0, y: MAP_SIZE.height },
               { x: 0, y: MAP_SIZE.height + 1 },
               { x: MAP_SIZE.width, y: MAP_SIZE.height + 1 },
               { x: MAP_SIZE.width, y: MAP_SIZE.height },
            ],
         ],
         stones: [
            { x: 8, y: 6, r: 0.5 },
            { x: 9, y: 5, r: 0.5 },
            { x: 3, y: 6, r: 0.5 },
         ],
         deadTanks: [{ x: 7.5, y: 3, r: 0.5 }],
      },
   };

   let isCollition: boolean = false;
   const collision = new Collision({ scene: scene.objects });

   const game = new Game({
      server,
      mediator,
      scene,
      cbs: {
         roundEnd,
      },
   });

   const keyPressed: IPressedKeys = {
      Down: false,
      Up: false,
      Right: false,
      Left: false,
   };

   const mousePos: TPoint = {
      x: 0,
      y: 0,
   };

   const keyDownHandler = (e: KeyboardEvent) => {
      if (inputRef.current !== document.activeElement) {
         if (e.code === "ArrowUp" || e.code === "KeyW") {
            keyPressed.Up = true;
         }
         if (e.code === "ArrowDown" || e.code === "KeyS") {
            keyPressed.Down = true;
         }
         if (e.code === "ArrowRight" || e.code === "KeyD") {
            keyPressed.Right = true;
         }
         if (e.code === "ArrowLeft" || e.code === "KeyA") {
            keyPressed.Left = true;
         }
      }
   };

   const keyUpHandler = (e: KeyboardEvent) => {
      if (inputRef.current !== document.activeElement) {
         if (e.code === "ArrowUp" || e.code === "KeyW") {
            keyPressed.Up = false;
         }
         if (e.code === "ArrowDown" || e.code === "KeyS") {
            keyPressed.Down = false;
         }
         if (e.code === "ArrowRight" || e.code === "KeyD") {
            keyPressed.Right = false;
         }
         if (e.code === "ArrowLeft" || e.code === "KeyA") {
            keyPressed.Left = false;
         }
      }
   };

   const mouseMoveHandler = (e: MouseEvent) => {
      mousePos.x = e.offsetX;
      mousePos.y = e.offsetY;
   };

   const drawWalls = (walls: TPoint[][]) => {
      walls.forEach((block) => {
         for (let i = block[1].x; i < block[3].x; i++) {
            for (let j = block[1].y; j > block[3].y; j--) {
               canvas?.spriteMap(img, i, j, ...wall);
            }
         }
      });
   };

   const drawHouses = (houses: TPoint[][]) => {
      houses.forEach((block) => {
         canvas?.spriteMap(img, block[1].x, block[1].y, ...home);
      });
   };
   //как то преобразить вектор
   const drawStones = (stones: TPoint[]) => {
      stones.forEach((circle) => {
         canvas?.spriteMap(img, circle.x - 0.5, circle.y + 0.5, ...stone);
      });
   };

   const drawGrass = (walls: TPoint[][]) => {
      for (let i = walls[0][1].x; i < walls[2][3].x; i += 5) {
         for (let j = walls[3][0].y; j > walls[1][2].y; j -= 5) {
            canvas?.spriteMap(img, i, j, ...grass);
         }
      }
   };

   const drawObjects = (objects: ISceneObjects) => {
      const { houses, stones, walls } = objects;
      drawGrass(walls);
      drawWalls(walls);
      drawHouses(houses);
      drawStones(stones);
   };

   const updateWIN = () => {
      const halfW = WIN.width / 2;
      const halfH = WIN.height / 2;
      WIN.left = unit.x - halfW;
      WIN.bottom = unit.y - halfH;
      if (unit.y - halfH < -1) {
         WIN.bottom = -1;
      }
      if (unit.y + halfH > MAP_SIZE.height + 1) {
         WIN.bottom = MAP_SIZE.height - WIN.height + 1;
      }
      if (unit.x - halfW < -1) {
         WIN.left = -1;
      }
      if (unit.x + halfW > MAP_SIZE.width + 1) {
         WIN.left = MAP_SIZE.width - WIN.width + 1;
      }
   };

   const updateUnit = () => {
      if (canvas) {
         unit.move(keyPressed);
         unit.rotate(
            Math.atan2(
               canvas.sy(mousePos.y) - unit.y,
               canvas.sx(mousePos.x) - unit.x
            )
         );
         updateWIN();
      }
   };

   const trace = (objects: ISceneObjects) => {
      tracer?.trace(unit, objects);
   };

   function roundEnd() {}

   function render(FPS: number) {
      const fpsGap = 0.5;
      const { objects } = game.getScene();
      if (canvas) {
         canvas.clear();
         trace(objects);
         drawObjects(objects);
         updateUnit();
         canvas.spriteDir(
            img,
            unit.x - 0.5,
            unit.y + 0.5,
            ...manFlag,
            Math.PI / 2 - unit.angle
         );

         isCollition = collision.checkAllBlocksUnit(
            unit,
            game.getScene().objects.deadTanks[0],
            isCollition
         );

         canvas.printText(
            `FPS: ${FPS}`,
            WIN.left + fpsGap,
            WIN.bottom + WIN.height - fpsGap,
            "black",
            20
         );
         canvas.render();
      }
   }

   return (
      <>
         <canvas id={canvasId} />
      </>
   );
};

export default GameCanvas;
