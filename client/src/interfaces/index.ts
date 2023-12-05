import { IError } from "../modules/Server/types";

export interface IUserData {
  login: string;
  password: string;
  nickName?: string;
}

<<<<<<< HEAD
export interface ISetPage {
   setPage: React.Dispatch<React.SetStateAction<TPage>>;
}

export type TPage =
   | "Lobby"
   | "Dossier"
   | "Loading"
   | "Menu"
   | "MainPage"
   | "Error"
   | "Registration"
   | "GamePage"
=======
export const ServerWarnings: IError[] & {id?:string} = [
  {
    code: 461,
    text: "Пользователя с таким логином не существует",
    id: "test_error_auth_userNotExist",
  },
  { code: 460, text: "Логин занят", id: "test_error_reg_loginOccupied" },
  {
    code: 403,
    text: "Неверный логин или пароль",
    id: "test_error_auth_wrongData",
  },
];
>>>>>>> 60a2dc80b0b1dac4a1766fe85067c58ddf415cf5
