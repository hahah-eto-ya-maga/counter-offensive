import BaseUnit from "./BaseUnit";

export default class TankCommander extends BaseUnit {
    constructor(x = 5, y = 5, angle = 0) {
        super(x, y, angle);
    }

    rotate(angle: number): void {
        this.angle = angle;
    }
}
