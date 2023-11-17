export interface IError {
   code: number;
   text: string;
   id?: string;
}

export interface IUser {
   login: string;
   nickname: string;
   token: string;
}

export interface IUserInfo {
   gameCount: number;
   scoreCount: number;
}
