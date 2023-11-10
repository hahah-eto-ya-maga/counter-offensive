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
   | "Dossier"
   | "Loading"
   | "Menu"
   | "MainPage"
   | "Error"
   | "Registration"
   | "GamePage";
