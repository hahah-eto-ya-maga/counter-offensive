import { IPressedKeys } from "../../GameCanvas";

export default class BaseUnit {
   x: number;
   y: number;
   angle: number;
   visiableAngle: number;
   speed: number;
   diagonalSpeed: number;
   visionDistance: number;

   constructor(x = 5, y = 5, angle = 0) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.visiableAngle = 120;
      this.visionDistance = 10;
      this.speed = 0.1;
      this.diagonalSpeed = (this.speed * Math.sqrt(2)) / 2;
   }

   move(keyPressed: IPressedKeys, time: number): void {
      return;
   }

   rotate(angle: number): void {
      return;
   }
}
