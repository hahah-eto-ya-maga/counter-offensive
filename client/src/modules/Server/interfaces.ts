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

interface IUnitBase {
  person_id: number;
  x: number;
  y: number;
  angle: number;
}

export interface ILobby {
  general: boolean;
  bannerman: boolean;
  tanks: {
    heavyTank: IHeavyTank[];
    middleTank: IMiddleTank[];
  };
  is_alive: boolean;
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
  role: EGamerRole;
}

interface IPoint {
  x: number;
  y: number;
}

export interface IBullet extends IPoint {
  type: number;
}

export interface IMob extends IPoint {
  person_id: number;
  angle: number;
}

export interface IGamer extends IMob {
  role: EGamerRole;
}

export interface ITank extends IPoint {}

export interface IScene {
  tanks: ITank[] | true;
  gamers: IGamer[] | true;
  mobs: IMob[] | true;
  bullets: IBullet[] | true;
  hashGamers: string;
  hashMobs: string;
  hashBullets: string;
}

export enum EGamerRole {
  general = "general",
  bannerman = "bannerman",
  heavyTankGunner = "heavyTankGunner",
  heavyTankMeh = "heavyTankMeh",
  heavyTankCommander = "heavyTankCommander",
  middleTankMeh = "middleTankMeh",
  middleTankGunner = "middleTankGunner",
  infantryRPG = "infantryRPG",
  infantry = "infantry",
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
