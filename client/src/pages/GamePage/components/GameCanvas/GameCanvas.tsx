import { FC, useContext, useEffect } from "react";
import {
    MAP_SIZE,
    WINConf,
    entitiesConfig,
    objectConf,
    requestDelay,
    walls,
} from "../../../../config";
import { MediatorContext, ServerContext } from "../../../../App";
import { TPoint, TUnit } from "../../types";
import {
    EBody,
    EGamerRole,
    EMapObject,
    EProjectile,
    ETank,
    IBody,
    IBullet,
    IGamer,
    IMapObject,
    IMob,
    ITank,
} from "../../../../modules/Server/interfaces";
import useCanvas from "../../hooks/useCanvas";
import useSprites, { SpriteFrame } from "../../hooks/useSprites";
import {
    BaseUnit,
    Canvas,
    Collision,
    Game,
    TraceMask,
    Infantry,
    InfantryRPG,
    MiddleCorpus,
    MiddleTower,
    HeavyCorpus,
    HeavyTower,
    TankCommander,
    Bannerman,
    General,
} from "../../modules";
import { IGameScene } from "../../modules/Game/Game";

export interface IPressedKeys {
    Up: boolean;
    Down: boolean;
    Right: boolean;
    Left: boolean;
    Space: boolean;
}

interface GameCanvasProps {
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const GameCanvas: FC<GameCanvasProps> = ({ inputRef }) => {
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);

    const canvasId = "canvas";

    let unit: TUnit = new BaseUnit();
    if (server.STORE.user) {
        const { x, y, angle } = server.STORE.user.unit;
        switch (server.STORE.user.unit.personId) {
            case EGamerRole.infantryRPG: {
                const { r, speed, weaponLength } = entitiesConfig.infantryRGP;
                unit = new InfantryRPG(x, y, angle, r, speed, weaponLength);
                break;
            }
            case EGamerRole.middleTankGunner: {
                const { rotateTowerSpeed, weaponLength, towerR } =
                    entitiesConfig.middleTank;
                unit = new MiddleTower(
                    x,
                    y,
                    angle,
                    towerR,
                    rotateTowerSpeed,
                    weaponLength
                );
                break;
            }
            case EGamerRole.middleTankMeh: {
                const { corpusR, rotateSpeed, speed } =
                    entitiesConfig.middleTank;
                unit = new MiddleCorpus(
                    x,
                    y,
                    angle,
                    corpusR,
                    speed,
                    rotateSpeed
                );
                break;
            }
            case EGamerRole.heavyTankGunner: {
                const { rotateTowerSpeed, weaponLength, towerR } =
                    entitiesConfig.heavyTank;
                unit = new HeavyTower(
                    x,
                    y,
                    angle,
                    towerR,
                    rotateTowerSpeed,
                    weaponLength
                );
                break;
            }

            case EGamerRole.heavyTankMeh: {
                const { corpusR, rotateSpeed, speed } =
                    entitiesConfig.heavyTank;
                unit = new HeavyCorpus(
                    x,
                    y,
                    angle,
                    corpusR,
                    speed,
                    rotateSpeed
                );
                break;
            }

            case EGamerRole.heavyTankCommander: {
                unit = new TankCommander(x, y, angle);
                break;
            }
            case EGamerRole.bannerman: {
                const { r, speed } = entitiesConfig.bannerman;
                unit = new Bannerman(x, y, angle, r, speed, 0);
                break;
            }
            case EGamerRole.general: {
                const { speed } = entitiesConfig.general;
                unit = new General(x, y, angle, speed);
                break;
            }

            default: {
                const { r, speed, weaponLength } = entitiesConfig.infantry;
                unit = new Infantry(x, y, angle, r, speed, weaponLength);
                break;
            }
        }
    }

    const updateUnitInterval = setInterval(() => {
        const { x, y, angle } = unit;
        const user = server.STORE.user;
        if (user) {
            const userUnit = user.unit.personId;
            if (
                userUnit !== EGamerRole.middleTankGunner &&
                userUnit !== EGamerRole.heavyTankGunner &&
                userUnit !== EGamerRole.heavyTankCommander
            ) {
                server.unitMotion(x, y, angle);
            } else {
                server.unitMotion(null, null, angle);
                if (game.serverUnit) {
                    unit.x = game.serverUnit.x;
                    unit.y = game.serverUnit.y;
                }
            }

            if (
                keyPressed.Space &&
                (userUnit === EGamerRole.infantry ||
                    userUnit === EGamerRole.infantryRPG ||
                    userUnit === EGamerRole.middleTankGunner ||
                    userUnit === EGamerRole.heavyTankGunner)
            ) {
                makeShot();
            }
        }
    }, requestDelay.gamerUpdate);

    const height = window.innerHeight;
    const width = window.innerWidth;
    const prop = width / height;
    const WIN = {
        left: -1,
        bottom: -1,
        width: WINConf.width * prop,
        height: WINConf.height,
    };
    const halfW = WIN.width / 2;
    const halfH = WIN.height / 2;
    const visualBorders = {
        left: halfW - 1,
        right: MAP_SIZE.width - halfW + 1,
        up: MAP_SIZE.height - halfH + 1,
        down: halfH - 1,
    };

    let tracer: TraceMask | null = null;
    let canvas: Canvas | null = null;
    const createCanvas = useCanvas(render);

    useEffect(() => {
        canvas = createCanvas({
            height,
            width,
            id: canvasId,
            WIN,
            callbacks: {
                keydown: keyDownHandler,
                keyup: keyUpHandler,
                mousemove: mouseMoveHandler,
                mouseDown: mouseDownHandler,
                mouseUp: mouseUpHandler,
            },
        });
        tracer = new TraceMask({
            WIN,
            canvas,
            width,
            height,
            cellSize: SPRITE_SIZE,
        });
        return () => {
            canvas = null;
            clearInterval(game.interval);
            game.server.STORE.clearHash();
            clearInterval(updateUnitInterval);
        };
    });

    const SPRITE_SIZE = width / WIN.width;
    const SIZE = 50;

    const [
        img,
        boom,
        middleTank,
        heavyTank,
        grass,
        stone,
        bush,
        home,
        wall,
        road,
        bulletAutomat,
        bulletRPG,
        manDead,
        manRPG,
        manAutomat,
        manFlag,
        mobDead,
        mobRPG,
        mobAutomat,
        corpusTank2,
        corpusTank3,
        towerTank2,
        towerTank3,
        corpusTank2Dead,
        corpusTank3Dead,
        towerTank2Dead,
        towerTank3Dead,
    ] = useSprites(SPRITE_SIZE, SIZE);

    const game = new Game({
        server,
        mediator,
        cbs: {
            roundEnd,
        },
    });

    const collision = new Collision(game.getScene());

    const keyPressed: IPressedKeys = {
        Down: false,
        Up: false,
        Right: false,
        Left: false,
        Space: false,
    };

    const mousePos: TPoint = {
        x: 0,
        y: 0,
    };

    // Callbacks

    const keyDownHandler = (e: KeyboardEvent) => {
        if (inputRef.current !== document.activeElement) {
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                keyPressed.Up = true;
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                keyPressed.Down = true;
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                keyPressed.Right = true;
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                keyPressed.Left = true;
            }
            if (e.code === "Space") {
                makeShot();
                keyPressed.Space = true;
            }
        }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
        if (inputRef.current !== document.activeElement) {
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                keyPressed.Up = false;
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                keyPressed.Down = false;
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                keyPressed.Right = false;
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                keyPressed.Left = false;
            }
            if (e.code === "Space") {
                keyPressed.Space = false;
            }
        }
    };

    const mouseMoveHandler = (e: MouseEvent) => {
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
    };

    const mouseUpHandler = () => {
        keyPressed.Space = false;
    };

    const mouseDownHandler = () => {
        makeShot();
        keyPressed.Space = true;
    };

    const makeShot = () => {
        const { x, y, angle, weaponLength } = unit;
        const user = server.STORE.user;
        if (user) {
            const userUnit = user.unit.personId;
            if (
                userUnit !== EGamerRole.heavyTankCommander &&
                userUnit !== EGamerRole.heavyTankMeh &&
                userUnit !== EGamerRole.middleTankMeh &&
                userUnit !== EGamerRole.bannerman
            ) {
                server.makeShot(
                    x + Math.cos(angle) * weaponLength,
                    y + Math.sin(angle) * weaponLength,
                    angle
                );
            }
        }
    };

    /* БЛОК ПРО РИСОВАНИЕ */

    const drawWalls = (walls: TPoint[][]) => {
        walls.forEach((block) => {
            for (let i = block[1].x; i < block[3].x; i++) {
                for (let j = block[1].y; j > block[3].y; j--) {
                    canvas?.spriteMap(img, i, j, ...wall);
                }
            }
        });
    };

    const drawGrass = () => {
        for (let i = 0; i < MAP_SIZE.width; i += 5) {
            for (let j = MAP_SIZE.height; j > 0; j -= 5) {
                canvas?.spriteMap(img, i, j, ...grass);
            }
        }
    };

    const drawObjects = (objects: IMapObject[]) => {
        const { stoneR: r } = objectConf;
        drawGrass();
        drawWalls(walls);
        objects.forEach((obj) => {
            const { x, y } = obj;
            switch (obj.type) {
                case EMapObject.house: {
                    canvas?.spriteDir(
                        img,
                        x,
                        y,
                        ...home,
                        obj.isVert ? (3 * Math.PI) / 2 : 0
                    );
                    return;
                }
                case EMapObject.stone: {
                    canvas?.spriteMap(img, x - r, y + r, ...stone);
                    return;
                }
            }
        });
    };

    const drawBullets = (bullets: IBullet[]) => {
        bullets.forEach((bullet) => {
            const { x, y, type, dx, dy } = bullet;
            const bulletSprite: SpriteFrame =
                type === EProjectile.grenade ? bulletRPG : bulletAutomat;
            canvas?.spriteDir(
                img,
                x - 0.5,
                y + 0.5,
                ...bulletSprite,
                Math.PI / 2 - Math.atan2(dy, dx)
            );
        });
    };

    const drawMobs = (mobs: IMob[]) => {
        mobs.forEach((mob) => {
            const mobSprite: SpriteFrame =
                mob.person_id === EGamerRole.infantry ? mobAutomat : mobRPG;
            canvas?.spriteDir(
                img,
                mob.x - 1,
                mob.y + 1,
                ...mobSprite,
                Math.PI / 2 - mob.angle
            );
        });
    };

    const drawTanks = (tanks: ITank[]) => {
        tanks.forEach((tank) => {
            const corpus: SpriteFrame =
                tank.type === ETank.middle ? corpusTank2 : corpusTank3;
            const tower: SpriteFrame =
                tank.type === ETank.middle ? towerTank2 : towerTank3;
            canvas?.spriteDir(
                img,
                tank.x - 3,
                tank.y + 3,
                ...corpus,
                tank.angle
            );
            canvas?.spriteDir(
                img,
                tank.x - 3,
                tank.y + 3,
                ...tower,
                -tank.tower_angle
            );
        });
    };

    const drawGamers = (gamers: IGamer[]) => {
        gamers.forEach((gamer) => {
            let gamerSprite: SpriteFrame | null = null;
            switch (gamer.person_id) {
                case EGamerRole.bannerman: {
                    gamerSprite = manFlag;
                    break;
                }
                case EGamerRole.infantry: {
                    gamerSprite = manAutomat;
                    break;
                }
                case EGamerRole.infantryRPG: {
                    gamerSprite = manRPG;
                    break;
                }
                default: {
                    return;
                }
            }
            canvas?.spriteDir(
                img,
                gamer.x - 1,
                gamer.y + 1,
                ...gamerSprite,
                Math.PI / 2 - gamer.angle
            );
        });
    };

    const drawBodies = (bodies: IBody[]) => {
        bodies.forEach((body) => {
            const { angle, type, x, y, isMob } = body;
            if (isMob) {
                canvas?.circle({ ...body, r: 0.5 }, "#F00");
                canvas?.spriteDir(
                    img,
                    x - 1,
                    y + 1,
                    ...mobDead,
                    Math.PI / 2 - angle
                );
                return;
            }
            switch (type) {
                case EBody.man: {
                    canvas?.circle({ ...body, r: 0.5 }, "#F00");
                    canvas?.spriteDir(
                        img,
                        x - 1,
                        y + 1,
                        ...manDead,
                        Math.PI / 2 - angle
                    );
                    break;
                }
                case EBody.middleTank: {
                    canvas?.spriteDir(
                        img,
                        x - 3,
                        y + 3,
                        ...corpusTank2Dead,
                        -angle
                    );
                    break;
                }
                case EBody.middleTower: {
                    canvas?.spriteDir(
                        img,
                        x - 3,
                        y + 3,
                        ...towerTank2Dead,
                        -angle
                    );
                    break;
                }
                case EBody.heavyTank: {
                    canvas?.spriteDir(
                        img,
                        x - 3,
                        y + 3,
                        ...corpusTank3Dead,
                        -angle
                    );
                    break;
                }
                case EBody.heavyTower: {
                    canvas?.spriteDir(
                        img,
                        x - 3,
                        y + 3,
                        ...towerTank3Dead,
                        -angle
                    );
                    break;
                }
            }
        });
    };

    const drawScene = (scene: IGameScene) => {
        const { bodies, bullets, gamers, mobs, map, tanks } = scene;
        drawObjects(map);
        drawBodies(bodies);
        drawBullets(bullets);
        drawMobs(mobs);
        drawTanks(tanks);
        drawGamers(gamers);
    };

    /*  */

    const updateWIN = () => {
        const { x, y } = unit;
        const { left, right, down, up } = visualBorders;
        WIN.left = x - halfW;
        WIN.bottom = y - halfH;
        if (y < down) {
            WIN.bottom = -1;
        }
        if (y > up) {
            WIN.bottom = MAP_SIZE.height - WIN.height + 1;
        }
        if (x < left) {
            WIN.left = -1;
        }
        if (x > right) {
            WIN.left = MAP_SIZE.width - WIN.width + 1;
        }
    };

    const updateEntity = (scene: IGameScene, time: number) => {
        scene.bullets.forEach((bullet) => {
            bullet.x += bullet.dx * (entitiesConfig.bulletSpeed / time);
            bullet.y += bullet.dy * (entitiesConfig.bulletSpeed / time);
        });

        // Не работает при долгих ответах с бека + нужен флаг идёт/ не идёт
        /* scene.mobs.forEach((mob) => {
         mob.x += Math.cos(mob.angle) * entitiesConfig.mobSpeed * time;
         mob.y += Math.sin(mob.angle) * entitiesConfig.mobSpeed * time;
      }); */
        // Решить со скоростю
        /* scene.gamers.forEach((gamer) => {
          gamer.x += Math.cos(gamer.angle) * entitiesConfig.gamerSpeed * time;
         gamer.y += Math.sin(gamer.angle) * entitiesConfig.gamerSpeed * time;
      }); */
    };

    const updateUnit = (time: number) => {
        if (game.serverUnit) {
            if (canvas) {
                const { x, y } = unit;
                const { down, left, right, up } = visualBorders;
                unit.move(keyPressed, time);
                if (unit instanceof General) {
                    if (x < left) {
                        unit.x = left;
                    }
                    if (y < down) {
                        unit.y = down;
                    }
                    if (x > right) {
                        unit.x = right;
                    }
                    if (y > up) {
                        unit.y = up;
                    }
                } else {
                    collision.checkAllBlocksUnit(unit);
                    unit.rotate(
                        Math.atan2(
                            canvas.sy(mousePos.y) - y,
                            canvas.sx(mousePos.x) - x
                        )
                    );
                }
                updateWIN();
            }
        }
    };

    function roundEnd() {}

    function render(FPS: number) {
        const fpsGap = 0.5;
        const renderTime = 1000 / FPS;
        const scene = game.getScene();
        if (canvas) {
            canvas.clear();
            drawScene(scene);
            updateUnit(renderTime);
            updateEntity(scene, renderTime);
            canvas.printText(
                `FPS: ${FPS}`,
                WIN.left + 3.5 * fpsGap,
                WIN.bottom + WIN.height - fpsGap,
                "black",
                20
            );
            canvas.render();
        }
    }

    return <canvas id={canvasId} />;
};

export default GameCanvas;
