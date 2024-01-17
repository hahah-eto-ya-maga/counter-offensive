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
   personId: EGamerRole;
}

export interface IBullet extends Omit<IPoint, "angle"> {
   type: EProjectile;
   dx: number;
   dy: number;
}

export interface IBody extends IPoint {
   type: EBody;
   isMob: boolean;
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

interface IStone extends Omit<IPoint, "angle"> {
   type: EMapObject.stone;
   sizeX: number;
   sizeY: number;
}

interface IHouse extends Omit<IPoint, "angle"> {
   type: EMapObject.house;
   sizeX: number;
   sizeY: number;
   isVert: boolean;
}

export type IMapObject = IStone | IHouse;

export interface IScene {
   tanks: ITank[] | null;
   gamers: IGamer[] | null;
   mobs: IMob[] | null;
   bullets: IBullet[] | null;
   bodies: IBody[] | null;
   map: IMapObject[] | null;
   hashMap: string;
   hashBodies: string;
   hashGamers: string;
   hashMobs: string;
   hashBullets: string;
   gamer: IUserUnit;
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

export enum EMapObject {
   house = 1,
   stone,
}

export enum EBody {
   man,
   heavyTank,
   middleTank,
   heavyTower,
   middleTower,
}

export enum EProjectile {
   bullet,
   grenade,
}
