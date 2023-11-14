import { IError } from "../modules/Server/types";

export interface IUserData {
  login: string;
  password: string;
  nickName?: string;
}

export interface ISetPage {
  setPage: React.Dispatch<React.SetStateAction<TPage>>;
}

export type TPage =
  | "Lobby"
  | "Loading"
  | "Menu"
  | "MainPage"
  | "Error"
  | "Registration"
  | "GamePage";

export const ServerWarnings: IError[] = [
  { code: 461, text: "Пользователя с таким логином не существует" },
  { code: 460, text: "Логин занят" },
  { code: 403, text: "Неверный логин или пароль" },
];
