/* import { TPoint, TWIN, TUnit } from "../../../pages/GamePage/types";
import { ISceneObjects } from "../../Game/Game";

export interface ICanvasOption {
   WIN: TWIN;
   width: number;
   height: number;
   id: string;
   callbacks: {
      keydown: (e: KeyboardEvent) => void;
      keyup: (e: KeyboardEvent) => void;
      mousemove: (e: MouseEvent) => void;
   };
}

class Canvas {
   WIN: TWIN;
   canvas: HTMLCanvasElement;
   context: CanvasRenderingContext2D;

   canvasV: HTMLCanvasElement;
   contextV: CanvasRenderingContext2D;

   canvasTrace: HTMLCanvasElement;
   contextTrace: CanvasRenderingContext2D;
   areaVisible: TPoint[];

   constructor({ WIN, id, height, width, callbacks }: ICanvasOption) {
      this.canvas = document.getElementById(id) as HTMLCanvasElement;
      this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

      this.canvasV = document.createElement("canvas");
      this.contextV = this.canvasV.getContext("2d") as CanvasRenderingContext2D;

      this.canvasTrace = document.createElement("canvas");
      this.contextTrace = this.canvasTrace.getContext("2d", {
         willReadFrequently: true,
      }) as CanvasRenderingContext2D;

      this.canvas.width = width;
      this.canvas.height = height;
      this.canvasV.width = width;
      this.canvasV.height = height;

      this.WIN = WIN;
      this.areaVisible = [];

      const { keydown, keyup, mousemove } = callbacks;

      window.addEventListener("keydown", keydown);
      window.addEventListener("keyup", keyup);
      window.addEventListener("mousemove", mousemove);
   }
   // переходи из Декартовой системы в Канвасную
   xs(x: number): number {
      return ((x - this.WIN.left) / this.WIN.width) * this.canvas.width;
   }

   ys(y: number): number {
      return (
         this.canvas.height -
         ((y - this.WIN.bottom) / this.WIN.height) * this.canvas.height
      );
   }

   // переходи из Канвасной системы в Декартову

   sx(xs: number): number {
      return (xs * this.WIN.width) / this.canvas.width + this.WIN.left;
   }

   sy(ys: number): number {
      return (
         (-ys * this.WIN.height) / this.canvas.height +
         this.WIN.bottom +
         this.WIN.height
      );
   }

   point(x: number, y: number, color = "#c00000", size = 2): void {
      this.contextV.beginPath();
      this.contextV.arc(this.xs(x), this.ys(y), size, 0, 2 * Math.PI);
      this.contextV.fillStyle = color;
      this.contextV.fill();
      this.contextV.closePath();
   }

   line(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      width = 1,
      color: string
   ): void {
      this.contextV.beginPath();
      this.contextV.moveTo(this.xs(x1), this.ys(y1));
      this.contextV.strokeStyle = color;
      this.contextV.lineWidth = width;
      this.contextV.setLineDash([]);
      this.contextV.lineTo(this.xs(x2), this.ys(y2));
      this.contextV.stroke();
      this.contextV.closePath();
   }

   polygon(points: TPoint[], color: string): void {
      this.contextV.beginPath();
      this.contextV.moveTo(this.xs(points[0].x), this.ys(points[0].y));
      for (let i = 1; i < points.length; i++) {
         this.contextV.lineTo(this.xs(points[i].x), this.ys(points[i].y));
      }
      this.contextV.fillStyle = color;
      this.contextV.fill();
      this.contextV.closePath();
   }

   circle(circle: TUnit, color = "#00f"): void {
      this.contextV.beginPath();
      this.contextV.arc(
         this.xs(circle.x),
         this.ys(circle.y),
         (circle.r * this.canvas.width) / this.WIN.width,
         0,
         2 * Math.PI
      );
      this.contextV.fillStyle = color;
      this.contextV.fill();
      this.contextV.closePath();
   }

   sprite(
      image: HTMLImageElement,
      dx: number,
      dy: number,
      dSize: number,
      sx: number,
      sy: number,
      sSize: number
   ) {
      if (dSize && sx >= 0 && sy >= 0 && sSize) {
         this.contextV.drawImage(
            image,
            sx,
            sy,
            sSize,
            sSize,
            this.xs(dx),
            this.ys(dy),
            dSize,
            dSize
         );
         return;
      }
      if (dSize) {
         this.contextV.drawImage(image, this.xs(dx), this.ys(dy), dSize, dSize);
         return;
      }
      this.contextV.drawImage(image, this.xs(dx), this.ys(dy));
   }

   spriteDir(
      image: HTMLImageElement,
      dx: number,
      dy: number,
      dSize: number,
      sx: number,
      sy: number,
      sSize: number,
      direction: number
   ) {
      if (direction) {
         const xs = this.xs(dx);
         const ys = this.ys(dy);
         const transX = xs + dSize / 2;
         const transY = ys + dSize / 2;
         this.contextV.save();
         this.contextV.translate(transX, transY);
         this.contextV.rotate(direction);
         this.contextV.translate(-transX, -transY);
         this.contextV.drawImage(
            image,
            sx,
            sy,
            sSize,
            sSize,
            xs,
            ys,
            dSize,
            dSize
         );
         this.contextV.restore();
         return;
      }
      this.sprite(image, dx, dy, dSize, sx, sy, sSize);
   }

   spriteMap(
      image: HTMLImageElement,
      dx: number,
      dy: number,
      dSize: number,
      sx: number,
      sy: number,
      sSize: number
   ) {
      if (dSize && sx >= 0 && sy >= 0 && sSize) {
         this.contextV.drawImage(
            image,
            sx,
            sy,
            sSize,
            sSize,
            this.xs(dx),
            this.ys(dy),
            dSize,
            dSize
         );
         return;
      }
      if (dSize) {
         this.contextV.drawImage(image, this.xs(dx), this.ys(dy), dSize, dSize);
         return;
      }
      this.contextV.drawImage(image, this.xs(dx), this.ys(dy));
   }

   clear() {
      this.contextV.fillStyle = "#333f";
      this.contextV.fillRect(0, 0, this.canvas.width, this.canvas.height);
   }

   printText(text: string, x: number, y: number, color = "black", size = 12) {
      this.contextV.font = `${size}px serif`;
      this.contextV.fillStyle = color;
      this.contextV.fillText(text, this.xs(x), this.ys(y));
   }

   drawImage(image: CanvasImageSource, dx: number, dy: number) {
      this.contextV.drawImage(image, dx, dy);
   }

   render() {
      this.context.drawImage(this.canvasV, 0, 0);
   }
}

export default Canvas;
 */

import { TPoint, TWIN } from "../../../pages/GamePage/types";
import { ISceneObjects } from "../../Game/Game";



export interface ICanvasOption {
   WIN: TWIN;
   width: number;
   height: number;
   id: string;
   callbacks: {
      keydown: (event: KeyboardEvent) => void;
      keyup: (event: KeyboardEvent) => void;
      mousemove: (event: MouseEvent) => void;
   };
}

export default class Canvas {
   WIN: TWIN;
   canvas: HTMLCanvasElement;
   context: CanvasRenderingContext2D;

   canvasV: HTMLCanvasElement;
   contextV: CanvasRenderingContext2D;

   canvasTrace: HTMLCanvasElement;
   contextTrace: CanvasRenderingContext2D;

   canvasMask: HTMLCanvasElement;
   contextMask: CanvasRenderingContext2D;

   areaVisible: TPoint[];

   constructor(options: ICanvasOption) {
      const { WIN, id, height, width, callbacks } = options;

      this.canvas = document.getElementById(id) as HTMLCanvasElement;
      this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

      this.canvasV = document.createElement("canvas");
      this.contextV = this.canvasV.getContext("2d") as CanvasRenderingContext2D;

      this.canvasTrace = document.createElement("canvas");
      this.contextTrace = this.canvasTrace.getContext("2d", {
         willReadFrequently: true,
      }) as CanvasRenderingContext2D;

      this.canvasMask = document.createElement("canvas");
      this.contextMask = this.canvasTrace.getContext("2d", {
         willReadFrequently: true,
      }) as CanvasRenderingContext2D;

      this.canvas.width = width;
      this.canvas.height = height;
      this.canvasV.width = width;
      this.canvasV.height = height;

      this.canvasTrace.width = width;
      this.canvasTrace.height = height;
      this.canvasMask.width = width;
      this.canvasMask.height = height;

      const { keydown, keyup, mousemove } = callbacks;
      window.addEventListener("keydown", (event: KeyboardEvent) =>
         keydown(event)
      );
      window.addEventListener("keyup", (event: KeyboardEvent) => keyup(event));

      window.addEventListener("mousemove", (event: MouseEvent) =>
         mousemove(event)
      );

      window.addEventListener(
         "contextmenu",
         (event: Event) => {
            event.preventDefault();
         },
         false
      );

      this.WIN = WIN;


      this.areaVisible = [];
   }

   xs(x: number): number {
      return ((x - this.WIN.left) / this.WIN.width) * this.canvas.width;
   }

   ys(y: number): number {
      return (
         this.canvas.height -
         ((y - this.WIN.bottom) / this.WIN.height) * this.canvas.height
      );
   }

   notxs(x: number): number {
      return ((x + this.WIN.width / 2) / this.WIN.width) * this.canvas.width;
   }

   notys(y: number): number {
      return (
         this.canvas.height -
         ((y + this.WIN.height / 2) / this.WIN.height) * this.canvas.height
      );
   }

   pxToX(px: number): number {
      return (px / this.canvas.width) * this.WIN.width - this.WIN.width / 2;
   }

   pxToY(px: number): number {
      return (
         ((this.canvas.height - px) / this.canvas.height) * this.WIN.height -
         this.WIN.height / 2
      );
   }

   point(x: number, y: number, color = "#c00000", size = 2): void {
      this.contextV.beginPath();
      this.contextV.arc(x, y, size, 0, 2 * Math.PI);
      this.contextV.fillStyle = color;
      this.contextV.fill();
      this.contextV.closePath();
   }

   line(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      width = 1,
      color: string
   ): void {
      this.contextV.beginPath();
      this.contextV.moveTo(this.xs(x1), this.ys(y1));
      this.contextV.strokeStyle = color;
      this.contextV.lineWidth = width;
      this.contextV.setLineDash([]);
      this.contextV.lineTo(this.xs(x2), this.ys(y2));
      this.contextV.stroke();
      this.contextV.closePath();
   }

   polygon(points: TPoint[], color: string): void {
      if (points.length >= 3) {
         this.contextTrace.fillStyle = color;
         this.contextTrace.beginPath();
         this.contextTrace.moveTo(this.xs(points[0].x), this.ys(points[0].y));
         for (let i = 1; i < points.length; i++) {
            this.contextTrace.lineTo(
               this.xs(points[i].x),
               this.ys(points[i].y)
            );
         }
         this.contextTrace.lineTo(this.xs(points[0].x), this.ys(points[0].y));
         this.contextTrace.closePath();
         this.contextTrace.fill();
      }
   }

   circle(circle: TPoint & { r: number }, color = "blue"): void {
      this.contextTrace.beginPath();
      this.contextTrace.arc(
         this.xs(circle.x),
         this.ys(circle.y),
         (circle.r * this.canvas.width) / this.WIN.width,
         0,
         2 * Math.PI
      );
      this.contextTrace.fillStyle = color;
      this.contextTrace.fill();
      this.contextTrace.closePath();
   }

   grid() {
      for (let i = 0; i <= this.WIN.left + this.WIN.width; i++) {
         this.line(
            i,
            this.WIN.bottom,
            i,
            this.WIN.bottom + this.WIN.height,
            0.3,
            "#c1c1c1"
         );
      }
      for (let i = 0; i >= this.WIN.left; i--) {
         this.line(
            i,
            this.WIN.bottom,
            i,
            this.WIN.bottom + this.WIN.height,
            0.3,
            "#c1c1c1"
         );
      }
      for (let i = 0; i <= this.WIN.bottom + this.WIN.height; i++) {
         this.line(
            this.WIN.left,
            i,
            this.WIN.left + this.WIN.width,
            i,
            0.3,
            "#c1c1c1"
         );
      }
      for (let i = 0; i >= this.WIN.bottom; i--) {
         this.line(
            this.WIN.left,
            i,
            this.WIN.left + this.WIN.width,
            i,
            0.3,
            "#c1c1c1"
         );
      }
   }

   sprite(
      image: HTMLImageElement,
      dx: number,
      dy: number,
      dSize: number,
      sx: number,
      sy: number,
      sSize: number
   ) {
      if (dSize && sx >= 0 && sy >= 0 && sSize) {
         this.contextV.drawImage(
            image,
            sx,
            sy,
            sSize,
            sSize,
            this.xs(dx),
            this.ys(dy),
            dSize,
            dSize
         );
         return;
      }
      if (dSize) {
         this.contextV.drawImage(image, this.xs(dx), this.ys(dy), dSize, dSize);
         return;
      }
      this.contextV.drawImage(image, this.xs(dx), this.ys(dy));
   }

   spriteDir(
      image: HTMLImageElement,
      dx: number,
      dy: number,
      dSize: number,
      sx: number,
      sy: number,
      sSize: number,
      direction: number
   ) {
      if (direction) {
         const xs = this.xs(dx);
         const ys = this.ys(dy);
         const transX = xs + dSize / 2;
         const transY = ys + dSize / 2;
         this.contextTrace.save();
         this.contextTrace.translate(transX, transY);
         this.contextTrace.rotate(direction);
         this.contextTrace.translate(-transX, -transY);
         this.contextTrace.drawImage(
            image,
            sx,
            sy,
            sSize,
            sSize,
            xs,
            ys,
            dSize,
            dSize
         );
         this.contextTrace.restore();
         return;
      }
      this.sprite(image, dx, dy, dSize, sx, sy, sSize);
   }

   spriteMap(
      image: HTMLImageElement,
      dx: number,
      dy: number,
      dSize: number,
      sx: number,
      sy: number,
      sSize: number
   ) {
      if (dSize && sx >= 0 && sy >= 0 && sSize) {
         this.contextV.drawImage(
            image,
            sx,
            sy,
            sSize,
            sSize,
            this.xs(dx),
            this.ys(dy),
            dSize,
            dSize
         );
         return;
      }
      if (dSize) {
         this.contextV.drawImage(image, this.xs(dx), this.ys(dy), dSize, dSize);
         return;
      }
      this.contextV.drawImage(image, this.xs(dx), this.ys(dy));
   }

   drawSceneTrace(scene: ISceneObjects) {
      const width = this.canvasTrace.width;
      const height = this.canvasTrace.height;
      this.contextMask.beginPath();
      this.contextMask.fillStyle = "#000f";
      this.contextMask.fillRect(0, 0, width, height);
      scene.houses.forEach((block) => this.polygon(block, "red"));
      scene.walls.forEach((block) => this.polygon(block, "red"));
      scene.stones.forEach((stone) => this.circle(stone, "red"));
      this.contextMask.closePath();
   }

   areaVis(points: TPoint[]): void {
      this.contextTrace.fillStyle = "#00ff";
      this.contextTrace.beginPath();
      this.contextTrace.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
         this.contextTrace.lineTo(points[i].x, points[i].y);
      }
      this.contextTrace.lineTo(points[0].x, points[0].y);
      this.contextTrace.fill();
      this.contextTrace.closePath();
   }

   trace(angleOfMovement: number, angleVisible: number): void {
      const pixelscene = this.contextMask.getImageData(
         0,
         0,
         this.canvasMask.width,
         this.canvasMask.height
      );

      this.areaVisible = [];
      this.areaVisible.push({
         x: this.canvasTrace.width / 2,
         y: this.canvasTrace.height / 2,
      });

      let vector: TPoint = { x: 0, y: 1 };
      const oneDegree = Math.PI / 180;
      for (let i = -angleVisible / 2; i <= angleVisible / 2; i += 0.5) {
         vector.x = Math.cos(angleOfMovement + i * oneDegree);
         vector.y = Math.sin(angleOfMovement + i * oneDegree);

         this.lineBrezen(vector, pixelscene);
      }

      this.contextTrace.clearRect(
         0,
         0,
         this.canvasTrace.width,
         this.canvasTrace.height
      );
      this.contextTrace.fillStyle = "#333f";
      this.contextTrace.fillRect(
         0,
         0,
         this.canvasTrace.width,
         this.canvasTrace.height
      );

      this.contextTrace.globalCompositeOperation = "destination-out";

      this.areaVis(this.areaVisible);

      this.contextTrace.globalCompositeOperation = "source-over";
   }

   lineBrezen(vector: TPoint, pixelscene: ImageData): void {
      const w = pixelscene.width;

      let isObject = false;
      let isVisiable = true;

      let x1 = this.canvasTrace.width / 2;
      let y1 = this.canvasTrace.height / 2;
      const x2 = this.notxs(vector.x);
      const y2 = this.notys(vector.y);
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
               x1 > this.canvasTrace.width ||
               y1 > this.canvasTrace.height
            ) {
               isVisiable = false;
               isObject = false;
               this.areaVisible.push({ x: x1 - sx, y: y1 - sy });
               return;
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
         this.areaVisible.push({ x: x1 + sx, y: y1 + sy });
      }
   }

   clear(): void {
      this.context.fillStyle = "#000f";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
   }

   clearRect(): void {
      this.contextTrace.clearRect(
         0,
         0,
         this.canvasV.width,
         this.canvasV.height
      );
      this.contextV.clearRect(0, 0, this.canvasV.width, this.canvasV.height);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
   }

   printText(text: string, x: number, y: number, color = "black", size = 12) {
      this.context.font = `${size}px serif`;
      this.context.fillStyle = color;
      this.context.fillText(text, this.xs(x), this.ys(y));
   }

   render(): void {
      this.context.drawImage(this.canvasV, 0, 0);
      this.context.drawImage(this.canvasTrace, 0, 0);
   }
}
