import { MAP_SIZE, objectConf } from "../../../../config";
import { EMapObject, IMapObject } from "../../../../modules/Server/interfaces";
import { TPoint, TUnit, TWIN } from "../../types";
import Canvas from "./Canvas/Canvas";

interface ITraceMaskProps {
    canvas: Canvas;
    WIN: TWIN;
    cellSize: number;
}

export default class TraceMask {
    canvas: Canvas;
    WIN: TWIN;
    maskCanv: HTMLCanvasElement;
    maskContext: CanvasRenderingContext2D;
    cellSize: number;
    pixcelScene: ImageData | null;

    constructor({ WIN, canvas, cellSize }: ITraceMaskProps) {
        const width = cellSize * (MAP_SIZE.width + 2);
        const height = cellSize * (MAP_SIZE.height + 2);

        this.WIN = WIN;
        this.canvas = canvas;
        this.cellSize = cellSize;

        this.maskCanv = document.createElement("canvas");
        this.maskContext = this.maskCanv.getContext(
            "2d"
        ) as CanvasRenderingContext2D;

        this.maskCanv.width = width;
        this.maskCanv.height = height;

        this.pixcelScene = null;
    }

    xs(x: number): number {
        return x * this.cellSize;
    }

    ys(y: number): number {
        return this.maskCanv.height - y * this.cellSize;
    }

    polygon(points: TPoint[], color: string = "#f00"): void {
        if (points.length >= 3) {
            this.maskContext.fillStyle = color;
            this.maskContext.beginPath();
            this.maskContext.moveTo(this.xs(points[0].x), this.ys(points[0].y));
            for (let i = 1; i < points.length; i++) {
                this.maskContext.lineTo(
                    this.xs(points[i].x),
                    this.ys(points[i].y)
                );
            }
            this.maskContext.lineTo(this.xs(points[0].x), this.ys(points[0].y));
            this.maskContext.closePath();
            this.maskContext.fill();
        }
    }

    circle(circle: TPoint & { r: number }, color = "#f00"): void {
        this.maskContext.beginPath();
        this.maskContext.arc(
            this.xs(circle.x),
            this.ys(circle.y),
            circle.r * this.cellSize,
            0,
            2 * Math.PI
        );
        this.maskContext.fillStyle = color;
        this.maskContext.fill();
        this.maskContext.closePath();
    }

    drawScene(scene: IMapObject[]) {
        this.maskContext.beginPath();
        this.maskContext.fillStyle = "#000f";
        this.maskContext.fillRect(
            0,
            0,
            this.maskCanv.width,
            this.maskCanv.height
        );
        scene.forEach((obj) => {
            const { x, y, sizeX: dx, sizeY: dy } = obj;
            const { r } = objectConf.stone;
            switch (obj.type) {
                case EMapObject.house: {
                    this.polygon([
                        { x, y },
                        { x: x + dx, y },
                        { x: x + dx, y: y - dy },
                        { x, y: y - dy },
                    ]);
                    break;
                }
                case EMapObject.stone:
                case EMapObject.bush:
                case EMapObject.stump: {
                    this.circle({ x: x + r, y: y + r, r });
                    break;
                }
                default: {
                    break;
                }
            }
        });
        this.maskContext.closePath();
    }

    getMaskImage(): ImageData {
        return this.maskContext.getImageData(
            0,
            0,
            this.maskCanv.width,
            this.maskCanv.height
        );
    }

    lineBrezen(start: TPoint, end: TPoint, pixelscene: ImageData): TPoint {
        const coef = 1;
        const w = pixelscene.width;

        let isObject = false;
        let isVisiable = true;

        let x1 = this.xs(start.x);
        let y1 = this.ys(start.y);
        let x2 = this.xs(end.x);
        let y2 = this.ys(end.y);

        const dx = Math.abs(x2 - x1);
        const sx = x1 < x2 ? 1 : -1;
        const dy = -Math.abs(y2 - y1);
        const sy = y1 < y2 ? 1 : -1;
        let n = dx > -dy ? coef * dx : -coef * dy;
        let error = dx + dy;
        for (; n > 0; n--) {
            if (isVisiable) {
                const pixelRed = pixelscene.data[y1 * (w * 4) + x1 * 4];
                if (
                    (isObject && pixelRed === 0) ||
                    x1 < 0 ||
                    y1 < 0 ||
                    x1 > this.maskCanv.width ||
                    y1 > this.maskCanv.height
                ) {
                    isVisiable = false;
                    isObject = false;
                    return { x: x1 - sx, y: y1 - sy };
                }
                if (pixelRed === 255) {
                    isObject = true;
                }
            }
            const err2 = 2 * error;
            if (err2 > dy) {
                error += dy;
                x1 += sx;
            }
            if (err2 < dx) {
                error += dx;
                y1 += sy;
            }
        }

        if (isVisiable) {
            return { x: x1 + sx, y: y1 + sy };
        }
        return { x: this.canvas.xs(start.x), y: this.canvas.ys(start.y) };
    }

    drawTrace(area: TPoint[]) {
        this.maskContext.fillStyle = "#fff";
        this.maskContext.beginPath();
        this.maskContext.moveTo(area[0].x, area[0].y);
        for (let i = 1; i < area.length; i++) {
            this.maskContext.lineTo(area[i].x, area[i].y);
        }
        this.maskContext.lineTo(area[0].x, area[0].y);
        this.maskContext.fill();
        this.maskContext.closePath();
    }

    trace(unit: TUnit, scene: IMapObject[]) {
        if (scene.length > 0 && !this.pixcelScene) {
            this.drawScene(scene);
            this.pixcelScene = this.getMaskImage();
            return;
        }
        if (this.pixcelScene) {
            const areaVisible: TPoint[] = [
                {
                    x: this.xs(unit.x),
                    y: this.ys(unit.y),
                },
            ];

            const oneDegree = Math.PI / 180;
            const angle = unit.visiableAngle / 2;
            for (let i = -angle; i <= angle; i++) {
                const end = {
                    x:
                        unit.x +
                        Math.cos(unit.angle + i * oneDegree) *
                            unit.visionDistance,
                    y:
                        unit.y +
                        Math.sin(unit.angle + i * oneDegree) *
                            unit.visionDistance,
                };

                if (end.x > MAP_SIZE.width) {
                    end.x = MAP_SIZE.width;
                }
                if (end.x < 0) {
                    end.x = 0;
                }

                if (end.y > MAP_SIZE.height) {
                    end.y = MAP_SIZE.height;
                }
                if (end.y < 0) {
                    end.x = 0;
                }

                areaVisible.push(
                    this.lineBrezen(
                        { x: unit.x, y: unit.y },
                        end,
                        this.pixcelScene
                    )
                );
            }
            this.drawTrace(areaVisible);

            // this.canvas.drawImage(this.maskCanv, 0, 0);
        }
    }
}
