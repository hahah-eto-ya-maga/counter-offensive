export {}
/* 

import { MAP_SIZE } from "../../config";
import { TPoint, TWIN } from "../../pages/GamePage/types";
import { ISceneObjects } from "../Game/Game";
import Canvas from "./Canvas/Canvas";
import Unit from "../../pages/GamePage/components/Game/Units/Unit";

interface ITraceMaskProps {
   canvas: Canvas;
   WIN: TWIN;
   height: number;
   width: number;
   cellSize: number;
}
const DELTAWIN = 1;

export default class TraceMask {
   canvas: Canvas;
   WIN: TWIN;
   oldWIN: TWIN;
   maskCanv: HTMLCanvasElement;
   maskContext: CanvasRenderingContext2D;
   cellSize: number;
   pixelScene: ImageData;

   constructor({ WIN, canvas, height, width, cellSize }: ITraceMaskProps) {
      this.WIN = WIN;
      this.oldWIN = {
         left: WIN.left + DELTAWIN,
         bottom: WIN.bottom + DELTAWIN,
         height: WIN.height - 2 * DELTAWIN,
         width: WIN.width - 2 * DELTAWIN,
      };

      this.canvas = canvas;
      this.cellSize = cellSize;

      this.maskCanv = document.createElement("canvas");
      this.maskContext = this.maskCanv.getContext("2d", {
         willReadFrequently: true,
      }) as CanvasRenderingContext2D;

      this.maskCanv.width = width;
      this.maskCanv.height = height;

      this.pixelScene = this.getMaskImage();
   }

   polygon(points: TPoint[], color: string): void {
      if (points.length >= 3) {
         this.maskContext.fillStyle = color;
         this.maskContext.beginPath();
         this.maskContext.moveTo(
            this.canvas.xs(points[0].x),
            this.canvas.ys(points[0].y)
         );
         for (let i = 1; i < points.length; i++) {
            this.maskContext.lineTo(
               this.canvas.xs(points[i].x),
               this.canvas.ys(points[i].y)
            );
         }
         this.maskContext.lineTo(
            this.canvas.xs(points[0].x),
            this.canvas.ys(points[0].y)
         );
         this.maskContext.closePath();
         this.maskContext.fill();
      }
   }

   circle(circle: TPoint & { r: number }, color = "blue"): void {
      this.maskContext.beginPath();
      this.maskContext.arc(
         this.canvas.xs(circle.x),
         this.canvas.ys(circle.y),
         (circle.r * this.maskCanv.width) / this.WIN.width,
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
      this.maskContext.fillRect(
         0,
         0,
         this.maskCanv.width,
         this.maskCanv.height
      );
      scene.houses.forEach((block) => this.polygon(block, "#f00"));
      scene.stones.forEach((stone) => this.circle(stone, "#f00"));
      this.maskContext.closePath();
   }

   getMaskImage(): ImageData {
      const delta = this.cellSize * DELTAWIN;
      return this.maskContext.getImageData(
         this.canvas.xs(this.oldWIN.left),
         this.canvas.ys(this.oldWIN.bottom + this.oldWIN.height),
         this.oldWIN.width * this.cellSize,
         this.oldWIN.height * this.cellSize
      );
   }

   lineBrezen(start: TPoint, end: TPoint, pixelscene: ImageData): TPoint {
      const coef = 1;
      const w = pixelscene.width;

      let isObject = false;
      let isVisiable = true;

      let x1 = this.canvas.xs(start.x);
      let y1 = this.canvas.ys(start.y);
      let x2 = this.canvas.xs(end.x);
      let y2 = this.canvas.ys(end.y);

      const dx = Math.abs(x2 - x1);
      const sx = x1 < x2 ? 1 : -1;
      const dy = -Math.abs(y2 - y1);
      const sy = y1 < y2 ? 1 : -1;
      let n = dx > -dy ? coef * dx : -coef * dy;
      let error = dx + dy;
      for (; n > 0; n--) {
         if (isVisiable) {
            const pixelRed = pixelscene.data[y1 * (w * 4) + x1 * 4];

            if (
               (isObject && pixelRed === 0) ||
               x1 < 0 ||
               y1 < 0 ||
               x1 > this.maskCanv.width ||
               y1 > this.maskCanv.height
            ) {
               isVisiable = false;
               isObject = false;
               return { x: x1 - sx, y: y1 - sy };
            }
            if (pixelRed === 255) {
               isObject = true;
            }
         }
         const err2 = 2 * error;
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
      return { x: this.canvas.xs(start.x), y: this.canvas.ys(start.y) };
   }

   drawTrace(area: TPoint[]) {
      this.maskContext.fillStyle = "#fff";
      this.maskContext.beginPath();
      this.maskContext.moveTo(area[0].x, area[0].y);
      for (let i = 1; i < area.length; i++) {
         this.maskContext.lineTo(area[i].x, area[i].y);
      }
      this.maskContext.lineTo(area[0].x, area[0].y);
      this.maskContext.fill();
      this.maskContext.closePath();
   }

   trace(unit: Unit, scene: ISceneObjects) {
      this.drawScene(scene);

      if (
         this.oldWIN.left - this.WIN.left < 0 ||
         this.oldWIN.bottom - this.WIN.bottom < 0 ||
         this.oldWIN.bottom - this.WIN.bottom > DELTAWIN ||
         this.oldWIN.left - this.WIN.left > DELTAWIN
      ) {
         this.oldWIN.left = this.WIN.left + DELTAWIN;
         this.oldWIN.bottom = this.WIN.bottom + DELTAWIN;
         this.pixelScene = this.getMaskImage();
      }

      const areaVisible: TPoint[] = [
         {
            x: this.canvas.xs(unit.x),
            y: this.canvas.ys(unit.y),
         },
      ];

      const oneDegree = Math.PI / 180;
      const angle = unit.visiableAngle / 2;
      for (let i = -angle; i <= angle; i++) {
         const end = {
            x:
               unit.x +
               Math.cos(unit.angle + i * oneDegree) * unit.visionDistance,
            y:
               unit.y +
               Math.sin(unit.angle + i * oneDegree) * unit.visionDistance,
         };

         if (end.x > MAP_SIZE.width) {
            end.x = MAP_SIZE.width;
         }
         if (end.x < 0) {
            end.x = 0;
         }

         if (end.y > MAP_SIZE.height) {
            end.y = MAP_SIZE.height;
         }
         if (end.y < 0) {
            end.x = 0;
         }

         areaVisible.push(
            this.lineBrezen({ x: unit.x, y: unit.y }, end, this.pixelScene)
         );
      }
      this.maskContext.globalCompositeOperation = "destination-out";
      this.drawTrace(areaVisible);
      this.maskContext.globalCompositeOperation = "source-over";

      this.canvas.drawImage(this.maskCanv, 0, 0);
   }
}
 */ 