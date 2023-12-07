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
   general: {
      occupied: boolean;
      available: boolean;
   };

   bannerman: {
      occupied: boolean;
   };

   heavyTank: {
      commander: boolean;
      mechanic: boolean;
      gunner: boolean;
   };

   middleTank: {
      gunner: boolean;
      mechanic: boolean;
   };

   tanks: {
      heavyTank: IHeavyTank[];
      middleTank: IMiddleTank[];
   };

   infantryRPG: boolean;
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
