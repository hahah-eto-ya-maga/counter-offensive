import { IPressedKeys } from "../../GameCanvas";
import Unit from "./Unit";

export default class TankCommander extends Unit {
   constructor(x = 5, y = 5, angle = 0) {
      super(x, y, angle);
   }

   move(keyPressed: IPressedKeys, time: number): void {
      return;
   }
}
