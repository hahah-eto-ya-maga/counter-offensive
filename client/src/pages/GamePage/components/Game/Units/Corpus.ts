import { IPressedKeys } from "../../GameCanvas";
import Unit from "./Unit";

export default class Corpus extends Unit {
   towerAngle: number;
   tankRotateSpeed: number;
   constructor(x = 5, y = 5, angle = 0, towerAngle = 0) {
      super(x, y, angle);
      this.towerAngle = towerAngle;
      this.tankRotateSpeed = Math.PI / 180;
      this.speed = 0.05;
   }

   move(keyPressed: IPressedKeys, time: number) {
      if (keyPressed.Left) {
         this.angle += this.tankRotateSpeed * time;
      }
      if (keyPressed.Right) {
         this.angle -= this.tankRotateSpeed * time;
      }
      if (keyPressed.Up) {
         this.x += this.speed * Math.sin(this.angle);
      }
      if (keyPressed.Down) {
         this.y -= this.speed * Math.cos(this.angle);
      }
   }

   rotate(angle: number) {
      return;
   }
}
