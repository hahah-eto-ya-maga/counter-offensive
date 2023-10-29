export interface IUserData {
  login: string;
  password: string;
  passwordTwo?: string;
}

export interface ISetPage {
  setPage: React.Dispatch<React.SetStateAction<TPage>>;
}

export type TPage = "Lobby" | "Dossier" | "Loading" | "Menu" | "MainPage";
