import { requestDelay, staticObjects } from '../../../../config';
import { Mediator, Server } from '../../../../modules';
import { EHash, IBullet, IGamer, IMob } from '../../../../modules/Server/interfaces';
import { TPoint } from '../../types';


export interface ISceneObjects {
   houses: TPoint[][];
   walls: TPoint[][];
   stones: (TPoint & { r: number })[];
}

export interface IGameScene {
   tanks: TPoint[];
   bullets: IBullet[];
   mobs: IMob[];
   gamers: IGamer[];
   bodies:TPoint[];
   objects: ISceneObjects;
}

interface IGame {
   server: Server;
   mediator: Mediator;
   cbs: {
      roundEnd: () => void;
   };
}

export default class Game {
   server: Server;
   mediator: Mediator;
   scene: IGameScene;
   interval: NodeJS.Timer;
   roundEnd: () => void;

   constructor({ server, mediator, cbs }: IGame) {
      this.server = server;
      this.mediator = mediator;
      this.roundEnd = cbs.roundEnd;
      this.scene = {
         bullets: [],
         mobs: [],
         gamers: [],
         tanks: [],
         bodies: [],
         objects: staticObjects,
      };

      this.interval = setInterval(async () => {
         const res = await server.getScene();
         if (res) {
            const {
               bullets,
               gamers,
               mobs,
               tanks,
               hashBullets,
               hashGamers,
               hashMobs,
            } = res;
            if (gamers !== true) {
               this.scene.gamers = gamers;
               this.server.STORE.setHash(EHash.gamers, hashGamers);
            }
            if (mobs !== true) {
               this.scene.mobs = mobs;
               this.server.STORE.setHash(EHash.mobs, hashMobs);
            }
            if (bullets !== true) {
               this.scene.bullets = bullets;
               this.server.STORE.setHash(EHash.bullets, hashBullets);
            }
         }
      }, requestDelay.game);
   }

   getScene() {
      return this.scene;
   }
}
