import { IPressedKeys } from "../../../components/GameCanvas/GameCanvas";

export default class BaseUnit {
    x: number;
    y: number;
    angle: number;
    r: number;
    visiableAngle: number;
    speed: number;
    diagonalSpeed: number;
    visionDistance: number;
    weaponLength: number;

    constructor(
        x = 5,
        y = 5,
        angle = 0,
        r = 0.35,
        speed = 0.1,
        weaponLength = 0
    ) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.r = r;
        this.weaponLength = weaponLength;
        this.visiableAngle = 120;
        this.visionDistance = 10;
        this.speed = speed;
        this.diagonalSpeed = (this.speed * Math.sqrt(2)) / 2;
    }

    move(keyPressed: IPressedKeys, time: number): void {
        return;
    }

    rotate(angle: number): void {
        return;
    }
}
