import { IPressedKeys } from "../../GameCanvas";
import Unit from "./Unit";

export default class Tower extends Unit {
   towerAngle: number;
   towerRotateSpeed: number;
   constructor(x = 5, y = 5, angle = 0, towerAngle = 0) {
      super(x, y, angle);
      this.towerAngle = towerAngle;
      this.towerRotateSpeed = Math.PI / 180;
   }

   move(keyPressed: IPressedKeys, time: number) {
      if (keyPressed.Left) {
         this.towerAngle += this.towerRotateSpeed * time;
      }
      if (keyPressed.Right) {
         this.towerAngle -= this.towerRotateSpeed * time;
      }
   }

   rotate(angle: number): void {
      return;
   }
}
