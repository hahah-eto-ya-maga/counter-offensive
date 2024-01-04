import { IPressedKeys } from "../../GameCanvas";
import BaseUnit from "./BaseUnit";

export default class Tower extends BaseUnit {
   towerRotateSpeed: number;
   constructor(x = 5, y = 5, angle = 0) {
      super(x, y, angle);
      this.towerRotateSpeed = Math.PI / 180;
   }

   move(keyPressed: IPressedKeys, time: number) {
      if (keyPressed.Left) {
         this.angle -= this.towerRotateSpeed * time;
      }
      if (keyPressed.Right) {
         this.angle += this.towerRotateSpeed * time;
      }
   }

   rotate(angle: number): void {
      return;
   }
}
