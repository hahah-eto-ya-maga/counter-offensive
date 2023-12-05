export interface IError {
  code: number;
  text: string;
  id?: string;
}

export interface IToken {
  token: string;
}

export interface IUserInfo {
  id: number;
  login: string;
  nickname: string;
  token: string;
  rank_name: string;
  gamer_exp: number;
  next_rang: number;
  level: number;
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

export enum ERank {
  Private = "Private",
  Sergeant = "Sergeant",
  Officer = "Officer",
  General = "General",
}
