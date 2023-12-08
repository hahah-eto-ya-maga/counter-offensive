import { SHA256 } from "crypto-js";
import Mediator from "../Mediator/Mediator";
import { IUserInfo, IError, IToken, IMessages } from "./types";
import Store from "../Store/Store";

export default class Server {
  mediator: Mediator;
  HOST: string;
  STORE: Store;
  error: IError | null;

  constructor(HOST: string, mediator: Mediator) {
    this.HOST = HOST;
    this.mediator = mediator;
    this.STORE = new Store();
    this.error = null;
  }

  async request<T>(method: string, params: any): Promise<T | null> {
    const { SERVER_ERROR } = this.mediator.getEventTypes();
    try {
      const str = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
      const res = await fetch(`${this.HOST}/api/?method=${method}&${str}`);
      const answer = await res.json();

      if (answer.result === "ok") {
        return answer.data;
      }
      this.error = answer.error;
      this.mediator.call<IError>(SERVER_ERROR, answer.error);
      return null;
    } catch (e) {
      this.error = { code: 9000, text: "Вообще всё плохо!" };
      this.mediator.call<IError>(SERVER_ERROR, this.error);
      return null;
    }
  }

  registration(
    login: string,
    nickname: string,
    password: string
  ): Promise<IUserInfo | null> {
    const hash = SHA256(login + password).toString();
    return this.request("registration", { login, nickname, hash });
  }

  login(login: string, password: string): Promise<IUserInfo | null> {
    const rnd = Math.random();
    const hash = SHA256(SHA256(login + password).toString() + rnd).toString();
    return this.request("login", { login, hash, rnd });
  }

  logout(): Promise<true | null> {
    return this.request("logout", { token: this.STORE.user?.token });
  }

  tokenVerification(): Promise<true | null> {
    return this.request("tokenVerification", {
      token: this.STORE.token,
    });
  }

  getAllInfo(login: string): Promise<IUserInfo | null> {
    return this.request("getAllInfo", { login, token: this.STORE.token });
  }

  updatePassword(login: string, newPassword: string): Promise<true | null> {
    const hash = SHA256(login + newPassword).toString();
    return this.request("updatePassword", {
      token: this.STORE.user?.token,
      hash,
    });
  }

  getMessages(): Promise<IMessages | true | null> {
    return this.request("getMessages", {
      token: this.STORE.user?.token,
      hash: this.STORE.chatHash,
    });
  }

  sendMessages(message: string): Promise<true | null> {
	console.log(this.STORE.user?.token)
    return this.request("sendMessage", { token: this.STORE.user?.token, message });
  }
}
