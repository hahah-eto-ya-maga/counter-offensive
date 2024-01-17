import { IPressedKeys } from "../../../components/GameCanvas/GameCanvas";

import BaseUnit from "./BaseUnit";

export default class MiddleCorpus extends BaseUnit {
   tankRotateSpeed: number;
   constructor(
      x = 5,
      y = 5,
      angle = 0,
      r: number,
      speed: number,
      rotateSpeed: number
   ) {
      super(x, y, angle, r, speed);
      this.tankRotateSpeed = rotateSpeed;
   }

   move(keyPressed: IPressedKeys, time: number) {
      const moveAngleDelta = Math.PI / 2;

      if (keyPressed.Left) {
         this.angle -= this.tankRotateSpeed * time;
      }
      if (keyPressed.Right) {
         this.angle += this.tankRotateSpeed * time;
      }
      if (keyPressed.Up) {
         this.x += this.speed * Math.sin(moveAngleDelta - this.angle);
         this.y -= this.speed * Math.cos(moveAngleDelta - this.angle);
      }
      if (keyPressed.Down) {
         this.y += this.speed * Math.cos(moveAngleDelta - this.angle);
         this.x -= this.speed * Math.sin(moveAngleDelta - this.angle);
      }
      this.angle = this.angle % (Math.PI * 2);
   }
}
