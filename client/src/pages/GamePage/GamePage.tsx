import React from "react";
import Canvas, { ICanvasOption } from "../../modules/Graph/Canvas/Canvas";
import MathGame from "../../modules/Graph/Math/MathGame";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {TKeyboard, TPoint, TUnit, TCheckBorder } from "../../modules/types/types";
import useCanvas from "../../modules/Graph/Canvas/useCanvas";
import Collision from "../../modules/Graph/Collision/Collision";
import "./GamePage.css"
import { manAutomat, corpusTank, towerTank } from "../../assets/svg";
import { grass, house, stone} from "../../assets/png";

const GamePage: React.FC = () => {

    const height = window.innerHeight;
    const width = window.innerWidth;
    const prop = width / height;

    let canvas: Canvas
    const Canvas = useCanvas((FPS) => renderScene(FPS))

    const location = useLocation()
    let unit = location.state.userRole

    const [FPS, setShowFPS] = useState<number>(0)

    const keyPressed: TKeyboard = {}

    const tank: TUnit = {x: 5, y: 4, r:0.5}
    const tankProp: TPoint = {x: 1.1*tank.r, y: 1.2*tank.r}

    const towerProp: TPoint = {x: 1.5*tank.r, y: 0.8*tank.r}

    const man: TUnit = {x: 6, y: 3, r: 0.16}
    const manProp: TPoint = {x: 1.4*man.r, y: man.r}

    const WIN = {
        left: -8 * prop + tank.x,
        bottom: -8 + tank.y,
        width: 16 * prop,
        height: 16,
    };

    const corpusTankImage = new Image()
    corpusTankImage.src = corpusTank

    const towerTankImage = new Image()
    towerTankImage.src = towerTank

    const manImage = new Image()
    manImage.src = manAutomat

    const houseImage = new Image()
    houseImage.src = house
    
    const grassImage = new Image()
    grassImage.src = grass

    const stoneImage = new Image()
    stoneImage.src = stone

    const math = new MathGame({WIN})
    let angleOfMovement = Math.PI/2;
    const speedRotate = Math.PI/256;
    const speedTank = 1/16;
    let speedTankNow = speedTank;
    const vectorTank: TPoint = {x: 0, y: 1}
    
    const speedInfantry = 1/18;
    let speedInfantryNow = speedInfantry

    const blocksArray: TPoint[][] = [[{x:4, y: 6.5}, {x:4, y: 8}, {x:7, y: 8}, {x:7, y: 6.5}], [{x:4, y: 9}, {x:4, y: 10}, {x:5, y: 10}, {x:5, y: 9}], 
        [{x:6, y: 9}, {x:6, y: 10}, {x:7, y: 10}, {x:7, y: 9}], 
        [{x:-1, y: -1}, {x:-1, y: 61}, {x:0, y: 61}, {x:0, y: -1}], [{x:0, y: -1}, {x:0, y: 0}, {x:75, y: 0}, {x:75, y: -1}],
        [{x:75, y: -1}, {x:75, y: 61}, {x:76, y: 61}, {x:76, y: -1}], [{x:0, y: 60}, {x:0, y: 61}, {x:75, y: 61}, {x:75, y: 60}]]
    const circlesArray: TUnit[] = [{x: 8, y: 6, r: 0.5}, {x: 9, y: 5, r: 0.3}, {x: 3.5, y: 6.5, r: 0.2}]
    const deadTank: TUnit = {x: 7.5, y: 3, r: 0.5}
    
    let isCollition: boolean = false

    const collision = new Collision({WIN, blocksArray, circlesArray})

    let cursorPosition: TPoint = {x:0, y:0}

    useEffect(() => {
        canvas = Canvas({
            id: 'canvas',
            width: width,
            height: height,
            WIN: WIN,
            callbacks: {
                keydown: (event) => {keyDown(event)},
                keyup: (event) => {keyUp(event)},
                mousemove: (event) => {mouseMove(event)},
            }
        });

        return () => {
            canvas.clearRect();
        };
    }, [])


    const keyDown = (event: KeyboardEvent): void => {
        if (event.code ==='ArrowUp' || event.code ==='KeyW') { 
            keyPressed.ArrowUp = true
        }
        if (event.code ==='ArrowDown' || event.code ==='KeyS') { 
            keyPressed.ArrowDown = true
        }
        if (event.code ==='ArrowRight' || event.code ==='KeyD') { 
            keyPressed.ArrowRight = true    
        }
        if (event.code ==='ArrowLeft' || event.code ==='KeyA') { 
            keyPressed.ArrowLeft = true    
        }       
    }

    const keyUp = (event: KeyboardEvent): void => {
        if (event.code ==='ArrowUp' || event.code ==='KeyW') { 
            keyPressed.ArrowUp = false
        }
        if (event.code ==='ArrowDown' || event.code ==='KeyS') { 
            keyPressed.ArrowDown = false   
        }
        if (event.code ==='ArrowRight' || event.code ==='KeyD') { 
            keyPressed.ArrowRight = false    
        }
        if (event.code ==='ArrowLeft' || event.code ==='KeyA') { 
            keyPressed.ArrowLeft = false    
        }       
    }

    const mouseMove = (event: MouseEvent): void => {
        cursorPosition.x = event.clientX
        cursorPosition.y = event.clientY
    }

    /* движение пехотинца по карте */
    const moveSceneInfantry = (keyPressed: TKeyboard) => {
        const diagonalSpeed = speedInfantry * Math.sqrt(2) / 2;
        if (keyPressed.ArrowUp && keyPressed.ArrowLeft || keyPressed.ArrowUp && keyPressed.ArrowRight ||
             keyPressed.ArrowDown && keyPressed.ArrowRight || keyPressed.ArrowDown && keyPressed.ArrowLeft) speedInfantryNow = diagonalSpeed 
        else speedInfantryNow = speedInfantry  
        
        if(keyPressed.ArrowUp) {
            WIN.bottom += speedInfantryNow;
        } 
        if(keyPressed.ArrowDown) {
            WIN.bottom -= speedInfantryNow;
        }
        if (keyPressed.ArrowLeft) {
            WIN.left -= speedInfantryNow;
        }
        if (keyPressed.ArrowRight) {
            WIN.left += speedInfantryNow;
        } 
        
        man.x = WIN.left + 8 * prop;
        man.y = WIN.bottom + 8
    }

    /* движение танка по карте*/
    const moveSceneTank = (keyPressed: TKeyboard) => {
        isCollition ? speedTankNow = speedTank / 3 : speedTankNow = speedTank 
        vectorTank.y = Math.sin(angleOfMovement) * speedTankNow;
        vectorTank.x = Math.cos(angleOfMovement) * speedTankNow;
        if(keyPressed.ArrowUp) {
            WIN.bottom += vectorTank.y
            WIN.left += vectorTank.x
        } 
        if(keyPressed.ArrowDown) {
            WIN.bottom -= vectorTank.y
            WIN.left -= vectorTank.x
        }

        tank.x = WIN.left + 8 * prop;
        tank.y = WIN.bottom + 8

        if (keyPressed.ArrowLeft && keyPressed.ArrowDown) {
            angleOfMovement -= speedRotate
        } else if (keyPressed.ArrowLeft) {
            angleOfMovement += speedRotate
        }

        if (keyPressed.ArrowRight && keyPressed.ArrowDown) {
            angleOfMovement += speedRotate
        } else if (keyPressed.ArrowRight) {
            angleOfMovement -= speedRotate
        }

    }

    
    const rotateGun = () => {
       /*  let vector: TPoint = {x:1,y:0}
        vector.x = canvas.pxToX(cursorPosition.x)
        vector.y = canvas.pxToY(cursorPosition.y)
        let toAngle = Math.atan2(vector.y, vector.x)
        
        canvas.rotateMan(manImage, manProp, toAngle) */
        
    }

    const renderScene = (FPS: number) => {
        if (canvas) {
            setShowFPS(FPS);
            canvas.clear();

            canvas.grid()

            // canvas.drawGrass(grassImage, [{x:0, y:0}, {x:0, y:12}, {x:12, y:12}, {x:12, y:0}])

            canvas.block(blocksArray[3], '#585')
            canvas.block(blocksArray[4], '#585')
            canvas.block(blocksArray[5], '#585')
            canvas.block(blocksArray[6], '#585')

            canvas.circle(deadTank, '#333')

            /* canvas.drawStone(stoneImage, circlesArray[0], Math.PI)
            canvas.drawStone(stoneImage, circlesArray[1], Math.PI / 2)
            canvas.drawStone(stoneImage, circlesArray[2], 0) */
           
            if (unit === 'Tank') {
                moveSceneTank(keyPressed) 
                isCollition = collision.checkAllBlocksUnit(tank, deadTank, isCollition, true)
                
                /* canvas.rotateTank(corpusTankImage, tankProp, angleOfMovement)
                canvas.rotateTower(towerTankImage, towerProp, angleOfMovement) */
            } 
            if (unit === 'RPG' || unit === "Automat") {
                moveSceneInfantry(keyPressed)
                isCollition = collision.checkAllBlocksUnit(man, deadTank, isCollition)
                rotateGun()
            }

            /* canvas.drawHouse(houseImage, blocksArray[0])
            canvas.drawHouse(houseImage, blocksArray[1])
            canvas.drawHouse(houseImage, blocksArray[2]) */
        }
    }

    return(
        <div className="game_page">
            <canvas id="canvas"></canvas>
            <span className="fps">FPS: {FPS}</span>
        </div>
       
    )    
}
export default GamePage;