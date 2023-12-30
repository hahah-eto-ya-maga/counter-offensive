export interface IError {
   code: number;
   text: string;
   id?: string;
}

export interface IMessage {
   nickname: string;
   text: string;
   level: number;
   rank_name: ERank;
   sendTime: string;
   userId: number;
}

export interface IMessages {
   chatHash: string;
   messages: IMessage[];
}

export interface IMiddleTank {
   id: number;
   Mechanic: boolean;
   Gunner: boolean;
}

export interface IHeavyTank extends IMiddleTank {
   Commander: boolean;
}

export interface ILobby {
   general: boolean;
   bannerman: boolean;
   tanks: {
      heavyTank: IHeavyTank[];
      middleTank: IMiddleTank[];
   };
   is_alive: IUserUnit | null;
}

export interface ILobbyState {
   lobby: ILobby;
   lobbyHash: string;
}

export interface IUserInfo {
   id: number;
   login: string;
   nickname: string;
   token: string | null;
   rank_name: ERank;
   gamer_exp: number;
   next_rang: number;
   level: number;
   unit: IUserUnit;
}

interface IPoint {
   x: number;
   y: number;
   angle: number;
}

export interface IUserUnit extends IPoint {
   personid: EGamerRole;
}

export interface IBullet extends IPoint {
   type: 0 | 1;
}

export interface IBody extends IPoint {
   type: number;
}

export interface IMob extends IPoint {
   person_id: EGamerRole.infantry | EGamerRole.infantryRPG;
}

export interface IGamer extends IPoint {
   person_id:
      | EGamerRole.general
      | EGamerRole.bannerman
      | EGamerRole.infantry
      | EGamerRole.infantryRPG;
}

export interface ITank extends IPoint {
   type: ETank;
   tower_angle: number;
}

export interface IScene {
   tanks: ITank[] | null ;
   gamers: IGamer[] | null;
   mobs: IMob[] | null;
   bullets: IBullet[] | null;
   bodies: IBody[] | null;
   hashBodies: string;
   hashGamers: string;
   hashMobs: string;
   hashBullets: string;
}

export enum EGamerRole {
   general = 1,
   bannerman,
   heavyTankGunner,
   heavyTankMeh,
   heavyTankCommander,
   middleTankMeh,
   middleTankGunner,
   infantry,
   infantryRPG,
}

export enum ERank {
   Private = "Private",
   Sergeant = "Sergeant",
   Officer = "Officer",
   General = "General",
}

export enum EHash {
   lobby = "lobby",
   bullets = "bullets",
   gamers = "gamers",
   mobs = "mobs",
   chat = "chat",
   map = "map",
   bodies = "bodies",
}

export enum ETank {
   middle,
   heavy,
}
