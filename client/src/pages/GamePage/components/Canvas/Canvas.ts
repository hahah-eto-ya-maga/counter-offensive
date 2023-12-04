import { TPoint, TUnit, TWIN } from "../../../../modules/types/types";
import MathGame from "../Math/MathGame";

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

   math: MathGame;

   areaVisible: TPoint[]

   constructor(options: ICanvasOption) {
      const { WIN, id, height, width, callbacks } = options;

      this.canvas = document.getElementById(id) as HTMLCanvasElement;
      this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

      this.canvasV = document.createElement("canvas");
      this.contextV = this.canvasV.getContext("2d") as CanvasRenderingContext2D;

      this.canvasTrace = document.createElement("canvas");
      this.contextTrace = this.canvasTrace.getContext("2d") as CanvasRenderingContext2D;

      this.canvas.width = width;
      this.canvas.height = height;
      this.canvasV.width = width;
      this.canvasV.height = height;
      this.canvasTrace.width = width;
      this.canvasTrace.height = height;

      const { keydown, keyup, mousemove } = callbacks;
      window.addEventListener("keydown", (event: KeyboardEvent) =>
         keydown(event)
      );
      window.addEventListener("keyup", (event: KeyboardEvent) => keyup(event));
      window.addEventListener("mousemove", (event: MouseEvent) =>
         mousemove(event)
      );

      this.WIN = WIN;

      this.math = new MathGame({ WIN });

      this.areaVisible = []
   }

   xs(x: number): number {
      this.areaVisible=[]
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
            this.contextTrace.lineTo(this.xs(points[i].x), this.ys(points[i].y));
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

   areaVis(points: TPoint[], color: string): void {
         this.contextTrace.fillStyle = color;
         this.contextTrace.beginPath();
         this.contextTrace.moveTo(points[0].x, points[0].y);
         for (let i = 1; i < points.length; i++) {
            this.contextTrace.lineTo(points[i].x, points[i].y);
         }
         this.contextTrace.lineTo(points[0].x, points[0].y);
         this.contextTrace.fill();
         this.contextTrace.closePath();
   }

   /*  drawHouse(house: HTMLImageElement, points: TPoint[]): void {
      this.contextV.drawImage(
         house,
         this.xs(points[1].x),
         this.ys(points[1].y),
         this.xs(points[2].x) - this.xs(points[0].x),
         this.ys(points[0].y) - this.ys(points[2].y + 0.1)
      );
   }

   drawGrass(grass: HTMLImageElement, points: TPoint[]): void {
      this.context.drawImage(
         grass,
         this.xs(points[1].x),
         this.ys(points[1].y),
         this.xs(points[2].x) - this.xs(points[0].x),
         this.ys(points[0].y) - this.ys(points[2].y)
      );
   }

   drawStone(stone: HTMLImageElement, circle: any, angle: number): void {
      this.context.drawImage(
         stone,
         this.xs(circle.x - circle.r) - 7,
         this.ys(circle.y + circle.r) - 5,
         this.xs(circle.x + circle.r) - this.xs(circle.x - circle.r) + 8,
         this.ys(circle.y - circle.r) - this.ys(circle.y + circle.r) + 7
      );
   }

   rotateTank(tank: HTMLImageElement, tankProp: TPoint, angle: number): void {
      this.context.save();
      this.context.translate(this.notxs(0), this.notys(0));
      this.context.rotate(-angle - Math.PI);
      this.context.drawImage(
         tank,
         (-tankProp.x * this.canvas.width) / this.WIN.width,
         (-tankProp.y * this.canvas.height) / this.WIN.height,
         (2 * tankProp.x * this.canvas.width) / this.WIN.width,
         (2 * tankProp.y * this.canvas.height) / this.WIN.height
      );
      this.context.restore();
   }

   rotateTower(
      tower: HTMLImageElement,
      towerProp: TPoint,
      angle: number
   ): void {
      this.context.save();
      this.context.translate(this.notxs(0), this.notys(0));
      this.context.rotate(-angle + Math.PI);
      this.context.drawImage(
         tower,
         (-1.5 * towerProp.x * this.canvas.width) / this.WIN.width,
         (-towerProp.y * this.canvas.height) / this.WIN.height,
         (2 * towerProp.x * this.canvas.width) / this.WIN.width,
         (2 * towerProp.y * this.canvas.height) / this.WIN.height
      );
      this.context.restore();
   }

   rotateMan(man: HTMLImageElement, manProp: TPoint, angle: number): void {
      this.context.save();
      this.context.translate(this.notxs(0), this.notys(0));
      this.context.rotate(-angle - Math.PI);
      this.context.drawImage(
         man,
         (-1.8 * manProp.x * this.canvas.width) / this.WIN.width,
         (-1.2 * manProp.y * this.canvas.height) / this.WIN.height,
         (2.8 * manProp.x * this.canvas.width) / this.WIN.width,
         (2.8 * manProp.y * this.canvas.height) / this.WIN.height
      );
      this.context.restore();
   } */

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
         this.context.drawImage(
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
         this.context.drawImage(image, this.xs(dx), this.ys(dy), dSize, dSize);
         return;
      }
      this.context.drawImage(image, this.xs(dx), this.ys(dy));
   }

   trace (
      vector: TPoint,
      angleOfMovement: number,
      angleVisible: number,
      blocks: TPoint[][],
      stones: TUnit[]
   ): void {

      this.contextTrace.fillStyle = "#000f";
      this.contextTrace.fillRect(0, 0, this.canvasTrace.width, this.canvasTrace.height);

      blocks.forEach(block => this.polygon(block, 'red'))
      stones.forEach(stone => this.circle(stone, 'red'))

      this.areaVisible = []

      this.areaVisible.push({x: this.notxs(0), y: this.notys(0)})

      const oneDegree = Math.PI / 180;
      for (let i = -angleVisible / 2; i <= angleVisible / 2; i += 1) {
         vector.x = Math.cos(angleOfMovement + i * oneDegree);
         vector.y = Math.sin(angleOfMovement + i * oneDegree);
         this.lineBrezen(vector);
      }

      this.contextTrace.clearRect(0,0,this.canvasTrace.width, this.canvasTrace.height)
      this.contextTrace.fillStyle = "#000f";
      this.contextTrace.fillRect(0, 0, this.canvasTrace.width, this.canvasTrace.height);

      this.contextTrace.globalCompositeOperation = 'destination-out'

      this.areaVis(this.areaVisible, "white")

      this.contextTrace.globalCompositeOperation = 'source-over'

   } 


   lineBrezen(vector: TPoint): void {
      let isObject = false;
      let isVisiable = true;

      let x1 = this.notxs(0);
      let y1 = this.notys(0);
      let x2 = this.notxs(vector.x);
      let y2 = this.notys(vector.y);
      const dx = Math.abs(x2 - x1);
      const sx = x1 < x2 ? 1 : -1;
      const dy = -Math.abs(y2 - y1);
      const sy = y1 < y2 ? 1 : -1;
      let n = dx > -dy ? 10*dx : -10*dy;
      let err2;
      let error = dx + dy;
      for (; n/10 > 0; n--) {
         if (isVisiable) {
            this.contextTrace.beginPath();
            const pixel = this.contextTrace.getImageData(x1, y1, 1, 1);

            if (isObject && pixel.data[0] !== 255) {
               isVisiable = false;
               isObject = false;
               this.areaVisible.push({x: x1, y: y1})
               return
            } else {
               if (pixel.data[0] === 255) {
                  isObject = true;
               }

               this.contextTrace.fillStyle = "#eeef";
               this.contextTrace.fillRect(x1, y1, 1, 1);

            }
            this.contextTrace.closePath();
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
      
      if(!isObject && isVisiable) {
         this.areaVisible.push({x: x1, y: y1})
      }

   }

   clear(): void {
      this.context.fillStyle = "#000f";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
   }

   clearRect(): void {
      this.contextV.clearRect(0, 0, this.canvasV.width,this.canvasV.height);
      this.context.clearRect(0, 0, this.canvas.width,this.canvas.height);
   }

   printText(text:string, x:number, y:number, color = "black", size = 12) {
      this.contextV.font = `${size}px serif`;
      this.contextV.fillStyle = color;
      this.contextV.fillText(text, this.xs(x), this.ys(y));
   }

   render(): void {
      this.context.drawImage(this.canvasV, 0, 0);
      // this.context.drawImage(this.canvasTrace, 0, 0);      
   }

   
}
