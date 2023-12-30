import { IUserUnit } from "../../../../../modules/Server/interfaces";
import { IPressedKeys } from "../../GameCanvas";

export default class Unit {
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

   move(keyPressed: IPressedKeys, time: number) {
      const speed =
         time *
         ((keyPressed.Up && keyPressed.Left) ||
         (keyPressed.Up && keyPressed.Right) ||
         (keyPressed.Down && keyPressed.Right) ||
         (keyPressed.Down && keyPressed.Left)
            ? this.diagonalSpeed
            : this.speed);

      if (keyPressed.Up) {
         this.y += speed;
      }
      if (keyPressed.Down) {
         this.y -= speed;
      }
      if (keyPressed.Left) {
         this.x -= speed;
      }
      if (keyPressed.Right) {
         this.x += speed;
      }
   }

   rotate(angle: number) {
      this.angle = angle;
   }
}
