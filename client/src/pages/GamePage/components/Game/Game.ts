import { TPoint } from "../../types";
import Mediator from "../../../../modules/Mediator/Mediator";
import Server from "../../../../modules/Server/Server";

export interface ISceneObjects {
   houses: TPoint[][];
   walls: TPoint[][];
   stones: (TPoint & { r: number })[];
   deadTanks:(TPoint & { r: number })[];
}

export interface IGameScene {
   tanks: TPoint[];
   bullets: TPoint[];
   bots: TPoint[];
   gamers: TPoint[];
   objects: ISceneObjects;
}

interface IGame {
   scene: IGameScene;
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
   cbs: {
      roundEnd: () => void;
   };

   constructor({ server, mediator, cbs, scene }: IGame) {
      this.server = server;
      this.mediator = mediator;
      this.cbs = cbs;
      this.scene = scene;
   }

   getScene() {
      return this.scene;
   }
}
