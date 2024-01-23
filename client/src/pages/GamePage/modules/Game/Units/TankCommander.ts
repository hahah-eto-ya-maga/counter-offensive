import BaseUnit from "./BaseUnit";

export default class TankCommander extends BaseUnit {
    constructor(x = 5, y = 5, angle = 0, visiableAngle = 180) {
        super(x, y, angle, 0, 0, 0, visiableAngle);
    }

    rotate(angle: number): void {
        this.angle = angle;
    }
}
