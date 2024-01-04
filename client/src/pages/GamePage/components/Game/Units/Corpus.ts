import { IPressedKeys } from "../../GameCanvas";
import BaseUnit from "./BaseUnit";

export default class Corpus extends BaseUnit {
   towerAngle: number;
   tankRotateSpeed: number;
   moveAngleDelta: number;
   constructor(x = 5, y = 5, angle = 0, towerAngle = 0) {
      super(x, y, angle);
      this.towerAngle = towerAngle;
      this.tankRotateSpeed = Math.PI / 180;
      this.speed = 0.005;
      this.moveAngleDelta = Math.PI / 2;
   }

   move(keyPressed: IPressedKeys, time: number) {
      if (keyPressed.Left) {
         this.angle -= this.tankRotateSpeed * time;
      }
      if (keyPressed.Right) {
         this.angle += this.tankRotateSpeed * time;
      }
      if (keyPressed.Up) {
         this.x += this.speed * Math.sin(this.moveAngleDelta - this.angle);
         this.y -= this.speed * Math.cos(this.moveAngleDelta - this.angle);
      }
      if (keyPressed.Down) {
         this.y += this.speed * Math.cos(this.moveAngleDelta - this.angle);
         this.x -= this.speed * Math.sin(this.moveAngleDelta - this.angle);
      }
   }
}
