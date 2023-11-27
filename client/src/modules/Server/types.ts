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
  sendTime: string;
}

export interface IChatHash {
  hash: string;
}
