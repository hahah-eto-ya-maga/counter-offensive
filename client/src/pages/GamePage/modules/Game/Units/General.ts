import { IPressedKeys } from "../../../components/GameCanvas/GameCanvas";
import BaseUnit from "./BaseUnit";

export default class General extends BaseUnit {
   constructor(x: number, y: number, angle: number, speed: number) {
      super(x, y, angle, 0, speed);
   }

   move(keyPressed: IPressedKeys, time: number): void {
      if (keyPressed.Up) {
         this.y += this.speed;
      }
      if (keyPressed.Down) {
         this.y -= this.speed;
      }
      if (keyPressed.Left) {
         this.x -= this.speed;
      }
      if (keyPressed.Right) {
         this.x += this.speed;
      }
   }
}
