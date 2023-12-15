import { IPressedKeys } from "../../../../../modules/Graph/GameCanvas";

export default class Unit {
   x: number;
   y: number;
   r: number;
   angle: number;
   visiableAngle: number;
   speed: number;
   diagonalSpeed: number;
   visionDistance: number;

   constructor() {
      this.x = 2;
      this.y = 2;
      this.r = 0.2;
      this.angle = 0;
      this.visiableAngle = 60;
      this.visionDistance = 2;
      this.speed = 0.01;
      this.diagonalSpeed = (this.speed * Math.sqrt(2)) / 2;
   }

   move(keyPressed: IPressedKeys) {
      const speed =
         (keyPressed.Up && keyPressed.Left) ||
         (keyPressed.Up && keyPressed.Right) ||
         (keyPressed.Down && keyPressed.Right) ||
         (keyPressed.Down && keyPressed.Left)
            ? this.diagonalSpeed
            : this.speed;

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

   shoot() {}

   die() {}
}
