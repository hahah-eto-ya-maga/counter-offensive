import { MAP_SIZE } from "../../config";
import { TPoint, TWIN } from "../../pages/GamePage/types";
import { ISceneObjects } from "../Game/Game";
import Canvas from "./Canvas/Canvas";

interface ITraceMaskProps {
   canvas: Canvas;
   WIN: TWIN;
   cellSize: number;

   //временно
   id: string;
}

export default class TraceMask {
   canvas: Canvas;
   WIN: TWIN;
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
      this.canvas = canvas;
      this.cellSize = cellSize;

      this.canvas1 = document.getElementById(id) as HTMLCanvasElement;
      this.context = this.canvas1.getContext("2d") as CanvasRenderingContext2D;
      this.canvas1.width = width;
      this.canvas1.height = height;

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

      this.pixelScene = this.maskContext.getImageData(0, 0, width, height);
   }

   // перевод из Декартовых в Канвас

   xs(x: number): number {
      return x * this.cellSize;
   }

   ys(y: number): number {
      return this.mask.height - y * this.cellSize;
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
      scene.houses.forEach((block) => this.polygon(block, "red"));
      scene.walls.forEach((block) => this.polygon(block, "red"));
      scene.stones.forEach((stone) => this.circle(stone, "red"));
      this.maskContext.closePath();

      this.context.drawImage(this.mask, 0, 0);
   }

   getDeltaWIN(): TPoint {
      // Смещение WIN относительно маски(без барьеров)
      const deltaWIN = {
         x: this.xs(this.WIN.left),
         y: this.ys(this.WIN.bottom + this.WIN.height),
      };
      if (deltaWIN.x < 0) {
         deltaWIN.x = 0;
      }
      if (deltaWIN.x > this.mask.width) {
         deltaWIN.x = this.mask.width;
      }
      if (deltaWIN.y < 0) {
         deltaWIN.y = 0;
      }
      if (deltaWIN.y > this.mask.height) {
         deltaWIN.y = this.mask.height;
      }
      return deltaWIN;
   }

   trace() {
      const deltaWIN = this.getDeltaWIN();
      const endWIN = {
         x: deltaWIN.x + this.WIN.width * this.cellSize,
         y: deltaWIN.y + this.WIN.height * this.cellSize,
      };
      const pixelWIN = [];
      for (let i = 0; i < endWIN.y - deltaWIN.y; i++) {
         const a =
            deltaWIN.y * this.mask.width + i * this.mask.width + deltaWIN.x;
         const b = a + endWIN.x - deltaWIN.x;

         pixelWIN.push(...this.pixelScene.data.slice(4 * a, 4 * b));
      }
   }
}
