export interface IError {
   code: number;
   text: string;
   id?: string;
}

export interface IToken {
   token: string;
}

export interface IUserInfo {
   gameCount: number;
   scoreCount: number;
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

export enum ERank {
   Private = "Private",
   Sergeant = "Sergeant",
   Officer = "Officer",
   General = "General",
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

   infantryRPG: boolean;
}

export interface ILobbyState {
   lobby: ILobby;
   tanks: {
      heavyTank: IHeavyTank[];
      middleTank: IMiddleTank[];
   };
   lobbyHash: string;
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
