import { objectConf, requestDelay } from "../../../../config";
import { Mediator, Server } from "../../../../modules";
import {
    EHash,
    EMapObject,
    IBody,
    IBullet,
    IGamer,
    IMapObject,
    IMob,
    ITank,
    IUserUnit,
} from "../../../../modules/Server/interfaces";

export interface IGameScene {
    tanks: ITank[];
    bullets: IBullet[];
    mobs: IMob[];
    gamers: IGamer[];
    bodies: IBody[];
    map: IMapObject[];
}

interface IGame {
    server: Server;
    mediator: Mediator;
    cbs: {
        roundEnd: () => void;
    };
}

export default class Game {
    serverUnit: IUserUnit | null;
    server: Server;
    mediator: Mediator;
    scene: IGameScene;
    interval: NodeJS.Timer;
    roundEnd: () => void;

    constructor({ server, mediator, cbs }: IGame) {
        this.server = server;
        this.mediator = mediator;
        this.roundEnd = cbs.roundEnd;
        this.serverUnit = { personId: 1, x: 0, y: 0, angle: 0 };
        this.scene = {
            bullets: [],
            mobs: [],
            gamers: [],
            tanks: [],
            bodies: [],
            map: [],
        };
        const { THROW_TO_LOBBY } = mediator.getTriggerTypes();
        this.interval = setInterval(async () => {
            const res = await server.getScene();
            if (res) {
                const {
                    is_dead,
                    is_end,
                    gamer,
                    bullets,
                    gamers,
                    mobs,
                    bodies,
                    tanks,
                    map,
                    hashBullets,
                    hashBodies,
                    hashGamers,
                    hashMobs,
                    hashMap,
                } = res;
                if (is_end) {
                    this.serverUnit = null;
                    return mediator.get(THROW_TO_LOBBY, "victory");
                }
                this.serverUnit = gamer;
                if (is_dead) {
                    mediator.get(THROW_TO_LOBBY, "defeat");
                }
                if (gamers) {
                    this.scene.gamers = gamers;
                    this.server.STORE.setHash(EHash.gamers, hashGamers);
                }
                if (mobs) {
                    this.scene.mobs = mobs;
                    this.server.STORE.setHash(EHash.mobs, hashMobs);
                }
                if (bullets) {
                    this.scene.bullets = bullets;
                    this.server.STORE.setHash(EHash.bullets, hashBullets);
                }
                if (bodies) {
                    this.scene.bodies = bodies;
                    server.STORE.setHash(EHash.bodies, hashBodies);
                }
                if (tanks) {
                    this.scene.tanks = tanks;
                    server.STORE.setHash(EHash.gamers, hashGamers);
                }
                if (map) {
                    this.scene.map = map.map((obj) => {
                        const { x, y, sizeX, sizeY, angle } = obj;
                        const isVert = sizeY > sizeX;
                        switch (obj.type) {
                            case EMapObject.fence:
                            case EMapObject.house: {
                                return {
                                    ...obj,
                                    y: y + sizeY,
                                    angle: (angle * Math.PI) / 180,
                                    isVert,
                                };
                            }
                            case EMapObject.stone:
                            case EMapObject.bush:
                            case EMapObject.stump:
                            case EMapObject.trusovMoment: {
                                return {
                                    ...obj,
                                    x: x + sizeX / 2,
                                    y: y + sizeY / 2,
                                };
                            }
                            case EMapObject.box:
                            case EMapObject.spike:
                            case EMapObject.road: {
                                return { ...obj, y: y + sizeY };
                            }
                            case EMapObject.crossyRoad:
                            case EMapObject.crossyRoadEnd:
                            case EMapObject.crossyRoadTurn:
                            case EMapObject.crossyRoadTurnCont:
                            case EMapObject.fenceTurn: {
                                return {
                                    ...obj,
                                    y: y + sizeY,
                                    angle: (angle * Math.PI) / 180,
                                };
                            }
                            default: {
                                return { ...obj };
                            }
                        }
                    });
                    server.STORE.setHash(EHash.map, hashMap);
                }
            }
        }, requestDelay.game);
    }

    getScene() {
        return this.scene;
    }
}
