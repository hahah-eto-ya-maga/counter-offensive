import internal from "stream";
import { MAP_SIZE } from "../../config";
import { TPoint, TWIN } from "../../pages/GamePage/types";
import { ISceneObjects } from "../Game/Game";
import Canvas from "./Canvas/Canvas";
import Unit from "../../pages/GamePage/components/Game/Units/Unit";

interface ITraceMaskProps {
   canvas: Canvas;
   WIN: TWIN;
   cellSize: number;

   //временно
   id: string;
}

const DELTAWIN = 1;

export default class TraceMask {
   canvas: Canvas;
   WIN: TWIN;
   oldWIN: TWIN;
   mask: HTMLCanvasElement;
   maskContext: CanvasRenderingContext2D;
   cellSize: number;
   pixelScene: ImageData;

   canvas1: HTMLCanvasElement;
   context: CanvasRenderingContext2D;

   constructor({ WIN, canvas, cellSize, id }: ITraceMaskProps) {
      const width = MAP_SIZE.width * cellSize;
      const height = MAP_SIZE.height * cellSize;

      this.mask = document.createElement("canvas");
      this.maskContext = this.mask.getContext("2d") as CanvasRenderingContext2D;

      this.mask.width = width;
      this.mask.height = height;

      this.WIN = WIN;
      this.oldWIN = {
         bottom: WIN.bottom - DELTAWIN,
         left: WIN.left - DELTAWIN,
         height: WIN.height + 2 * DELTAWIN,
         width: WIN.width + 2 * DELTAWIN,
      };
      this.canvas = canvas;
      this.cellSize = cellSize;

      this.canvas1 = document.getElementById(id) as HTMLCanvasElement;
      this.context = this.canvas1.getContext("2d") as CanvasRenderingContext2D;
      this.canvas1.width = width;
      this.canvas1.height = height;

      setInterval(() => {}, 300);

      this.drawScene({
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
      });

      this.pixelScene = this.getImage();
   }

   // перевод из Декартовых в Канвас

   xs(x: number): number {
      return x * this.cellSize;
   }

   ys(y: number): number {
      return this.mask.height - y * this.cellSize;
   }

   getImage(): ImageData {
      return this.maskContext.getImageData(
         this.xs(this.oldWIN.left),
         this.ys(this.oldWIN.bottom + this.oldWIN.height),
         this.oldWIN.width * this.cellSize,
         this.oldWIN.height * this.cellSize
      );
   }

   polygon(points: TPoint[], color: string) {
      if (points.length >= 3) {
         this.maskContext.fillStyle = color;
         this.maskContext.beginPath();
         this.maskContext.moveTo(this.xs(points[0].x), this.ys(points[0].y));
         for (let i = 1; i < points.length; i++) {
            this.maskContext.lineTo(this.xs(points[i].x), this.ys(points[i].y));
         }
         this.maskContext.lineTo(this.xs(points[0].x), this.ys(points[0].y));
         this.maskContext.closePath();
         this.maskContext.fill();
      }
   }

   circle({ x, y, r }: TPoint & { r: number }, color: string) {
      this.maskContext.beginPath();
      this.maskContext.arc(
         this.xs(x),
         this.ys(y),
         r * this.cellSize,
         0,
         2 * Math.PI
      );
      this.maskContext.fillStyle = color;
      this.maskContext.fill();
      this.maskContext.closePath();
   }

   drawScene(scene: ISceneObjects) {
      this.maskContext.beginPath();
      this.maskContext.fillStyle = "#000f";
      this.maskContext.fillRect(0, 0, this.mask.width, this.mask.height);
      scene.houses.forEach((block) => this.polygon(block, "#f00"));
      scene.walls.forEach((block) => this.polygon(block, "#f00"));
      scene.stones.forEach((stone) => this.circle(stone, "#f00"));
      this.maskContext.closePath();
   }

   trace(unit: Unit) {
      const areaVisible: TPoint[] = [{ x: unit.x, y: unit.y }];

      if (
         this.WIN.left - this.oldWIN.left < 0 ||
         this.WIN.bottom - this.oldWIN.bottom < 0 ||
         this.oldWIN.bottom +
            this.oldWIN.height -
            (this.WIN.bottom + this.WIN.height) <
            0 ||
         this.oldWIN.left +
            this.oldWIN.width -
            (this.WIN.left + this.WIN.width) <
            0
      ) {
         this.oldWIN.left = this.WIN.left - DELTAWIN;
         this.oldWIN.bottom = this.WIN.bottom - DELTAWIN;
         this.pixelScene = this.getImage();
      }
   }

   lineBrezen(start: TPoint, end: TPoint, pixelscene: ImageData): TPoint {
      const w = pixelscene.width;

      let isObject = false;
      let isVisiable = true;

      let x1 = this.xs(start.x);
      let y1 = this.ys(start.y);
      const x2 = 1;
      const y2 = 1;
      const dx = Math.abs(x2 - x1);
      const sx = x1 < x2 ? 1 : -1;
      const dy = -Math.abs(y2 - y1);
      const sy = y1 < y2 ? 1 : -1;
      let n = dx > -dy ? 10 * dx : -10 * dy;
      let err2;
      let error = dx + dy;
      for (; n > 0; n--) {
         if (isVisiable) {
            const pixelRed = pixelscene.data[y1 * (w * 4) + x1 * 4];

            if (
               (isObject && pixelRed === 0) ||
               x1 < 0 ||
               y1 < 0 ||
               x1 > this.mask.width ||
               y1 > this.mask.height
            ) {
               isVisiable = false;
               isObject = false;
               return { x: x1 - sx, y: y1 - sy };
            }
            if (pixelRed === 255) {
               isObject = true;
            }
         }

         err2 = 2 * error;
         if (err2 > dy) {
            error += dy;
            x1 += sx;
         }
         if (err2 < dx) {
            error += dx;
            y1 += sy;
         }
      }

      if (isVisiable) {
         return { x: x1 + sx, y: y1 + sy };
      }
      return { ...start };
   }
}
