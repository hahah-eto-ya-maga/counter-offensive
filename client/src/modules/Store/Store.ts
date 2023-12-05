import { IUserInfo } from "../Server/types";

export default class Store {
  token: string | null;
  lobbyHash: string | null;
  bulletHash: string | null;
  gameHash: string | null;
  chatHash: string | null;
  user: IUserInfo | null;

  constructor() {
    this.token = localStorage.getItem("token") ?? null;
    this.lobbyHash = null;
    this.bulletHash = null;
    this.gameHash = null;
    this.chatHash = null;
    this.user = null;
  }
}
