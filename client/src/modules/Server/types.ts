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
