import { tank2 } from "../../../assets/pngs";
import { TPoint, TWIN, TUnit } from "../../types/types";
import MathGame from "../Math/MathGame";

export interface ICanvasOption {
    WIN: TWIN,
    width: number,
    height: number,
    id: string;
    callbacks: {
        keydown: (event: KeyboardEvent) => void
        keyup: (event: KeyboardEvent) => void
        mousemove: (event: MouseEvent) => void
    }
}

class Canvas {

    WIN: TWIN;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    math: MathGame

    constructor(options: ICanvasOption) {
        const { WIN, id, height, width, callbacks } = options

        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.canvas.width = width;
        this.canvas.height = height;

        const {keydown, keyup, mousemove} = callbacks;
        window.addEventListener('keydown', (event: KeyboardEvent) => keydown(event));
        window.addEventListener('keyup', (event: KeyboardEvent) => keyup(event));
        window.addEventListener('mousemove', (event: MouseEvent) => mousemove(event));

        this.WIN = WIN;

        this.math = new MathGame({WIN});
    }

    xs(x: number): number { 
        return (x - this.WIN.left) / this.WIN.width * this.canvas.width;
    }

    ys(y: number): number { 
        return this.canvas.height - (y - this.WIN.bottom) / this.WIN.height * this.canvas.height;
    }

    notxs(x: number): number {
        return (x + this.WIN.width / 2) / this.WIN.width * this.canvas.width;
    }

    notys(y: number): number { 
        return this.canvas.height - (y + this.WIN.height / 2) / this.WIN.height * this.canvas.height;
    }

    pxToX(px: number): number {
        return px / this.canvas.width * this.WIN.width - this.WIN.width / 2
    }

    pxToY(px: number): number {
        return (this.canvas.height - px) / this.canvas.height * this.WIN.height - this.WIN.height/2
    }

    point (x: number, y: number, color = '#c00000', size = 2): void {
        this.context.beginPath();
        this.context.arc(this.xs(x), this.ys(y), size, 0, 2 * Math.PI);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    }

    line (x1: number, y1: number, x2: number, y2: number, width = 1, color:string): void {
        this.context.beginPath();     
        this.context.moveTo(this.xs(x1), this.ys(y1));
        this.context.strokeStyle = color;
        this.context.lineWidth = width;
        this.context.setLineDash([]);
        this.context.lineTo(this.xs(x2), this.ys(y2));
        this.context.stroke();
        this.context.closePath();
    }

    grid() {
        for (let i = 0; i <= this.WIN.left + this.WIN.width; i++) {
            this.line(i, this.WIN.bottom, i, this.WIN.bottom + this.WIN.height, 0.1, '#c1c1c1');
        }
        for (let i = 0; i >= this.WIN.left; i--) {
            this.line(i, this.WIN.bottom, i, this.WIN.bottom + this.WIN.height, 0.1, '#c1c1c1');
        }
        for (let i = 0; i <= this.WIN.bottom + this.WIN.height; i++) {
            this.line(this.WIN.left, i, this.WIN.left + this.WIN.width, i, 0.1, '#c1c1c1');
        }
        for (let i = 0; i >= this.WIN.bottom; i--) {
            this.line(this.WIN.left, i, this.WIN.left + this.WIN.width, i, 0.1, '#c1c1c1');
        }
    }

    border (points:TPoint[], color: string, colorBorder: string): void {
        this.context.beginPath();
        this.context.moveTo(this.xs(points[3].x), this.ys(points[3].y));
        this.context.strokeStyle = colorBorder;
        this.context.lineWidth = 2
        this.context.setLineDash([]);
        for (let i = 0; i < points.length; i++) {
                this.context.lineTo(this.xs(points[i].x), this.ys(points[i].y));
                this.context.stroke()
        }
        this.context.closePath();
    }
    
    rotateTank(tank: HTMLImageElement, angle: number): void {
        this.context.save()
        this.context.translate(this.notxs(0), this.notys(0))
        this.context.rotate(-angle - Math.PI)
        this.context.drawImage(tank, -tank.width/2 , -tank.height/2 , 1.1*this.canvas.width/this.WIN.width,  this.canvas.height/this.WIN.height)
        this.context.restore();
    }

    man(size: number, color = '#c00000'): void {
        this.context.beginPath();
        this.context.arc(this.notxs(0), this.notys(0), size * this.canvas.width/ this.WIN.width, 0, 2 * Math.PI);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    }

    block(points: TPoint[], color: string): void {
        this.context.beginPath();
        this.context.moveTo(this.xs(points[0].x), this.ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.context.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    }

    circle (circle: TUnit, color = "blue"): void {
        this.context.beginPath();
        this.context.arc(this.xs(circle.x), this.ys(circle.y), circle.r * this.canvas.width / this.WIN.width, 0, 2 * Math.PI);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    }

    rotateGun(gun: HTMLImageElement, angle: number): void {
        this.context.save()
        this.context.translate(this.notxs(0), this.notys(0))
        this.context.rotate(- angle - Math.PI)
        this.context.drawImage(gun, -gun.width/3.1, -gun.height/4.3, gun.width/2, gun.height/2)
        this.context.restore();
    }


    clear(): void {
        this.context.fillStyle = '#999';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clearRect(): void {
        this.context.clearRect(0,0,this.WIN.width, this.WIN.height)
    }

}

export default Canvas;