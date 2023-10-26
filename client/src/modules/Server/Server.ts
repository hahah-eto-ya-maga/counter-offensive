import { SHA256 } from "crypto-js";
import Mediator from "../Mediator/Mediator";
import { IUserInfoResponse, IError, IUserResponse } from "./types";

export default class Server {
  mediator: Mediator;
  HOST: string;

  constructor(HOST: string, mediator: Mediator) {
    this.HOST = HOST;
    this.mediator = mediator;
  }

  async request<T>(method: string, params: any): Promise<T | null> {
    const { SERVER_ERROR } = this.mediator.getEventTypes();
    try {
      const str = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
      const res = await fetch(`${this.HOST}/?method=${method}&${str}`);
      const answer = await res.json();
      console.log(answer);

      if (answer.result === "ok") {
        return answer.data;
      }
      this.mediator.call<IError>(SERVER_ERROR, answer.error);
      return null;
    } catch (e) {
      this.mediator.call<IError>(SERVER_ERROR, {
        code: 9000,
        text: "Вообще всё плохо!",
      });
      return null;
    }
  }

  registration(login: string, password: string): Promise<IUserResponse | null> {
    const hash = SHA256(login + password).toString();
    return this.request("registration", { login, hash });
  }

  login(login: string, password: string): Promise<IUserResponse | null> {
    const rnd = Math.random().toString();
    const hash = SHA256(SHA256(login + password).toString() + rnd).toString();
    return this.request("login", { login, hash, rnd });
  }

  logout(login: string, token: string): Promise<boolean | null> {
    return this.request("logout", { token, login });
  }

  tokenVerification(login: string, token: string): Promise<boolean | null> {
    return this.request("tokenVerification", { login, token });
  }

  getAllInfo(login: string, token: string): Promise<IUserResponse | null> {
    return this.request("getAllInfo", { login, token });
  }

  updatePassword(
    login: string,
    token: string,
    newPassword: string
  ): Promise<boolean | null> {
    const hash = SHA256(login + newPassword).toString();
    return this.request("updatePassword", { login, token, hash });
  }
}
