import { FC, useContext, useEffect } from "react";
import { MAP_SIZE } from "../../../config";
import { MediatorContext, ServerContext } from "../../../App";
import { TPoint } from "../types";
import {
  IBullet,
  IGamer,
  IMob,
  ITank,
} from "../../../modules/Server/interfaces";
import useCanvas from "./hooks/useCanvas";
import useSprites from "./hooks/useSprites";
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
      road,
      bulletAutomat,
      bulletRPG,
      manDead,
      manRPG,
      manAutomat,
      manFlag,
      mobDead,
      mobRPG,
      mobAutomat,
      corpusTank2,
      corpusTank3,
      towerTank2,
      towerTank3,
      corpusTank2Dead,
      corpusTank3Dead,
      towerTank2Dead,
      towerTank3Dead,
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
    bullets.forEach((bullet) => {
      canvas?.circle({ ...bullet, r: 0.01 }, "black");
    });
  };

  const drawMobs = (mobs: IMob[]) => {
    mobs.forEach((mob) => {
      canvas?.circle({ ...mob, r: 0.5 }, "#0F0");
    });
  };

  const drawTanks = (tanks: ITank[]) => {
    tanks.forEach((tank) => {
      canvas?.circle({ ...tank, r: 1 }, "green");
    });
  };

  const drawGamers = (gamers: IGamer[]) => {
    gamers.forEach((gamer) => {
      canvas?.circle({ ...gamer, r: 1 }, "#333");
    });
  };

  const drawBodies = (bodies: TPoint[]) => {
    bodies.forEach((body) => {
      canvas?.circle({ ...body, r: 1 }, "beige");
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

  function roundEnd() {}

  function render(FPS: number) {
    const fpsGap = 0.5;
    const scene = game.getScene();
    if (canvas) {
      canvas.clear();
      drawScene(scene);
      updateUnit();
      canvas.spriteDir(
        img,
        unit.x - 1,
        unit.y + 1,
        ...manFlag,
        Math.PI / 2 - unit.angle
      );

      // временно 1 мёртвый танк #TODO
      isCollition = collision.checkAllBlocksUnit(
        unit,
        { x: 10, y: 10, r: 0.2 },
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

  return <canvas id={canvasId} />;
};

export default GameCanvas;
