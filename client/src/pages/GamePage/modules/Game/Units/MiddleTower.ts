import { IPressedKeys } from "../../../components/GameCanvas/GameCanvas";

import BaseUnit from "./BaseUnit";

export default class MiddleTower extends BaseUnit {
   rotateSpeed: number;
   constructor(
      x = 5,
      y = 5,
      angle = 0,
      r = 0,
      rotateSpeed = Math.PI / 180,
      weaponLength = 1
   ) {
      super(x, y, angle, r, weaponLength);
      this.rotateSpeed = rotateSpeed;
   }

   move(keyPressed: IPressedKeys, time: number) {
      if (keyPressed.Left) {
         this.angle += this.rotateSpeed * time;
      }
      if (keyPressed.Right) {
         this.angle -= this.rotateSpeed * time;
      }
      this.angle = this.angle % (Math.PI * 2);
   }

   rotate(angle: number): void {
      return;
   }
}
