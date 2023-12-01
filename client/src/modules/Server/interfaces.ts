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
  Private='Private',
  Sergeant='Sergeant',
  Officer= 'Officer',
  General='General',
}
