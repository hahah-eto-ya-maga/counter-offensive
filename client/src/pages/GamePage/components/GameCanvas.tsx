import { FC, useContext, useEffect } from "react";
import { MAP_SIZE, entitiesConfig, requestDelay } from "../../../config";
import { MediatorContext, ServerContext } from "../../../App";
import { TPoint } from "../types";
import {
   EGamerRole,
   ETank,
   IBody,
   IBullet,
   IGamer,
   IMob,
   ITank,
} from "../../../modules/Server/interfaces";
import useCanvas from "./hooks/useCanvas";
import useSprites, { SpriteFrame } from "./hooks/useSprites";
import Game, { IGameScene, ISceneObjects } from "./Game/Game";
import Collision from "./Game/Collision/Collision";
import Canvas from "./Graph/Canvas/Canvas";
import Unit from "./Game/Units/Unit";
import TraceMask from "./Graph/TraceMask";

export interface IPressedKeys {
   Up: boolean;
   Down: boolean;
   Right: boolean;
   Left: boolean;
   Space: boolean;
}

interface GameCanvasProps {
   inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const GameCanvas: FC<GameCanvasProps> = ({ inputRef }) => {
   const server = useContext(ServerContext);
   const mediator = useContext(MediatorContext);

   const canvasId = "canvas";

   let unit: Unit = new Unit();
   if (server.STORE.user) {
      const { x, y, angle } = server.STORE.user.unit;
      unit = new Unit(x, y, angle);
   }

   const updateUnitInterval = setInterval(() => {
      const { x, y, angle } = unit;
      const user = server.STORE.user;
      if (user) {
         const userUnit = user.unit.personid;
         if (
            userUnit !== EGamerRole.middleTankGunner &&
            userUnit !== EGamerRole.heavyTankGunner &&
            userUnit !== EGamerRole.heavyTankCommander
         ) {
            server.moveUnit(x, y);
         }
         server.rotateUnit(angle);

         if (keyPressed.Space) {
            makeShot();
         }
      }
   }, requestDelay.gamerUpdate);

   const height = window.innerHeight;
   const width = window.innerWidth;
   const prop = width / height;
   const WIN = {
      left: -1,
      bottom: -1,
      width: 15 * prop,
      height: 15,
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
            mouseDown: mouseDownHandler,
            mouseUp: mouseUpHandler,
         },
      });
      tracer = new TraceMask({
         WIN,
         canvas,
         width,
         height,
         cellSize: SPRITE_SIZE,
      });
      return () => {
         canvas = null;
         clearInterval(game.interval);
         game.server.STORE.clearHash();
         clearInterval(updateUnitInterval);
      };
   });

   const SPRITE_SIZE = width / WIN.width;
   const SIZE = 50;

   const [
      img,
      boom,
      middleTank,
      heavyTank,
      grass,
      stone,
      bush,
      home,
      wall,
      bulletSprite,
      manDead,
      manRPG,
      manAutomat,
      manFlag,
      corpusTank2,
      corpusTank3,
      towerTank2,
      towerTank3,
   ] = useSprites(SPRITE_SIZE, SIZE);

   const game = new Game({
      server,
      mediator,
      cbs: {
         roundEnd,
      },
   });

   let isCollition: boolean = false;
   const collision = new Collision({ scene: game.getScene().objects });

   const keyPressed: IPressedKeys = {
      Down: false,
      Up: false,
      Right: false,
      Left: false,
      Space: false,
   };

   const mousePos: TPoint = {
      x: 0,
      y: 0,
   };

   // Callbacks

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
         if (e.code === "Space") {
            makeShot();
            keyPressed.Space = true;
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
         if (e.code === "Space") {
            keyPressed.Space = false;
         }
      }
   };

   const mouseMoveHandler = (e: MouseEvent) => {
      mousePos.x = e.offsetX;
      mousePos.y = e.offsetY;
   };

   const mouseUpHandler = () => {
      keyPressed.Space = false;
   };

   const mouseDownHandler = () => {
      makeShot();
      keyPressed.Space = true;
   };

   const makeShot = () => {
      const { x, y, angle } = unit;
      const user = server.STORE.user;
      if (user) {
         const userUnit = user.unit.personid;
         if (
            userUnit !== EGamerRole.heavyTankCommander &&
            userUnit !== EGamerRole.heavyTankMeh &&
            userUnit !== EGamerRole.middleTankMeh &&
            userUnit !== EGamerRole.bannerman
         ) {
            server.makeShot(x, y, angle);
         }
      }
   };

   /* БЛОК ПРО РИСОВАНИЕ */

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

   const drawStones = (stones: TPoint[]) => {
      stones.forEach((circle) => {
         canvas?.spriteMap(img, circle.x - 1, circle.y + 1, ...stone);
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

   const drawBullets = (bullets: IBullet[]) => {
      // Что то не то со спрайтом пуль
      bullets.forEach((bullet) => {
         /* canvas?.spriteDir(
            img,
            bullet.x,
            bullet.y,
            ...bulletSprite,
            Math.PI / 2 - bullet.angle
         ); */
         canvas?.circle({ ...bullet, r: 0.1 }, "#F00");
      });
   };

   const drawMobs = (mobs: IMob[]) => {
      // у мобов будут спрайты отличные от игроков
      mobs.forEach((mob) => {
         canvas?.circle({ ...mob, r: 0.5 }, "#0F0");
         const mobSprite: SpriteFrame =
            mob.person_id === EGamerRole.infantry ? manAutomat : manRPG;
         canvas?.spriteDir(
            img,
            mob.x - 1,
            mob.y + 1,
            ...mobSprite,
            Math.PI / 2 - mob.angle
         );
      });
   };

   const drawTanks = (tanks: ITank[]) => {
      tanks.forEach((tank) => {
         const corpus: SpriteFrame =
            tank.type === ETank.middle ? corpusTank2 : corpusTank3;
         const tower: SpriteFrame =
            tank.type === ETank.middle ? towerTank2 : towerTank3;
         canvas?.circle({ ...tank, r: 1.5 }, "#0FF");
         canvas?.spriteDir(
            img,
            tank.x - 2,
            tank.y + 2.1,
            ...corpus,
            Math.PI / 2 - tank.angle
         );
         canvas?.spriteDir(
            img,
            tank.x-3,
            tank.y+3,
            ...tower,
            Math.PI / 2 - tank.tower_angle
         );
      });
   };

   const drawGamers = (gamers: IGamer[]) => {
      gamers.forEach((gamer) => {
         let gamerSprite: SpriteFrame | null = null;
         switch (gamer.person_id) {
            case EGamerRole.bannerman: {
               gamerSprite = manFlag;
               break;
            }
            case EGamerRole.infantry: {
               gamerSprite = manAutomat;
               break;
            }
            case EGamerRole.infantryRPG: {
               gamerSprite = manRPG;
               break;
            }
            default: {
               return;
            }
         }
         canvas?.circle({ ...gamer, r: 0.5 }, "#333");
         canvas?.spriteDir(
            img,
            gamer.x - 1,
            gamer.y + 1,
            ...gamerSprite,
            Math.PI / 2 - gamer.angle
         );
      });
   };

   const drawBodies = (bodies: IBody[]) => {
      bodies.forEach((body) => {
         canvas?.circle({ ...body, r: 0.5 }, "#F00");
         canvas?.spriteDir(
            img,
            body.x - 1,
            body.y + 1,
            ...manDead,
            Math.PI / 2 - body.angle
         );
      });
   };

   const drawScene = (scene: IGameScene) => {
      const { bodies, bullets, gamers, mobs, objects, tanks } = scene;
      drawObjects(objects);
      drawBodies(bodies);
      drawBullets(bullets);
      drawMobs(mobs);
      drawTanks(tanks);
      drawGamers(gamers);
   };

   /*  */

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

   const updateEntity = (scene: IGameScene, time: number) => {
      scene.bullets.forEach((bullet) => {
         bullet.x += Math.cos(bullet.angle) * entitiesConfig.bulletSpeed * time;
         bullet.y += Math.sin(bullet.angle) * entitiesConfig.bulletSpeed * time;
      });

      // Не работает при долгих ответах с бека + нужен флаг идёт/ не идёт

      /* scene.mobs.forEach((mob) => {
         mob.x += Math.cos(mob.angle) * entitiesConfig.mobSpeed * time;
         mob.y += Math.sin(mob.angle) * entitiesConfig.mobSpeed * time;
      });

      // Решить со скоростю
      scene.gamers.forEach((gamer) => {
         gamer.x += Math.cos(gamer.angle) * entitiesConfig.gamerSpeed * time;
         gamer.y += Math.sin(gamer.angle) * entitiesConfig.gamerSpeed * time;
      }); */
   };

   const updateUnit = (time: number) => {
      if (canvas) {
         unit.move(keyPressed, time);
         unit.rotate(
            Math.atan2(
               canvas.sy(mousePos.y) - unit.y,
               canvas.sx(mousePos.x) - unit.x
            )
         );
         updateWIN();
      }
   };

   function roundEnd() {}

   function render(FPS: number) {
      const fpsGap = 0.5;
      const renderTime = FPS / 1000;
      const scene = game.getScene();
      if (canvas) {
         canvas.clear();
         drawScene(scene);
         updateUnit(renderTime);
         updateEntity(scene, renderTime);

         // временно 1 мёртвый танк #TODO
         isCollition = collision.checkAllBlocksUnit(
            { ...unit, r: 0.5 },
            { x: 10, y: 10, r: 0.2 },
            isCollition
         );

         canvas.printText(
            `FPS: ${FPS}`,
            WIN.left + 3.5 * fpsGap,
            WIN.bottom + WIN.height - fpsGap,
            "black",
            20
         );
         canvas.render();
      }
   }

   return <canvas id={canvasId} />;
};

export default GameCanvas;
