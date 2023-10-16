import React from "react";
import { TWIN } from "../../types/types";
import MathGame from "../Math/MathGame";

export interface ICanvasOption {
    WIN: TWIN,
    width: number,
    height: number,
    id: string;
    callbacks: {
        keydown: (event: KeyboardEvent) => void
        keyup: (event: KeyboardEvent) => void
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

        const {keydown, keyup} = callbacks;
        window.addEventListener('keydown', (event: KeyboardEvent) => keydown(event));
        window.addEventListener('keyup', (event: KeyboardEvent) => keyup(event));

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

    polygon (points: {x: number, y: number}[], color: string, colorBorder: string): void {
        this.context.beginPath();
        this.context.moveTo(this.xs(points[3].x), this.ys(points[3].y));
        this.context.strokeStyle = colorBorder;
        this.context.lineWidth = 2
        this.context.setLineDash([]);
        for (let i = 0; i < points.length; i++) {
                this.context.lineTo(this.xs(points[i].x), this.ys(points[i].y));
                this.context.stroke()
        }
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    }
    
    tank(points: {x: number, y: number}[]): void {
        this.context.beginPath();
        this.context.moveTo(this.notxs(points[0].x), this.notys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.context.lineTo(this.notxs(points[i].x), this.notys(points[i].y));
        }
        this.context.fillStyle = 'red';
        this.context.fill();
        this.context.closePath();

    }

    clear(): void {
        this.context.fillStyle = '#777';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clearRect(): void {
        this.context.clearRect(0,0,this.WIN.width, this.WIN.height)
    }

}

export default Canvas;