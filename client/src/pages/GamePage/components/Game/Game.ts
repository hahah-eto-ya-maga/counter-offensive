import { requestDelay, staticObjects } from "../../../../config";
import { Mediator, Server } from "../../../../modules";
import {
   EHash,
   IBody,
   IBullet,
   IGamer,
   IMob,
   ITank,
   IUserUnit,
} from "../../../../modules/Server/interfaces";
import { TPoint } from "../../types";

export interface ISceneObjects {
   houses: TPoint[][];
   walls: TPoint[][];
   stones: (TPoint & { r: number })[];
}

export interface IGameScene {
   tanks: ITank[];
   bullets: IBullet[];
   mobs: IMob[];
   gamers: IGamer[];
   bodies: IBody[];
   map: ISceneObjects;
}

interface IGame {
   server: Server;
   mediator: Mediator;
   cbs: {
      roundEnd: () => void;
   };
}

export default class Game {
   serverUnit: IUserUnit;
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
         map: staticObjects,
      };
      this.interval = setInterval(async () => {
         const res = await server.getScene();
         if (res) {
            const {
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
            this.serverUnit = gamer;
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
               server.STORE.setHash(EHash.map, hashMap);
            }
         }
      }, requestDelay.game);
   }

   getScene() {
      return this.scene;
   }
}
