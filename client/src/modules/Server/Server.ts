import { SHA256 } from "crypto-js";
import Mediator from "../Mediator/Mediator";
import { IUserInfo, IError, IUser } from "./types";

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
         const res = await fetch(`${this.HOST}/api/?method=${method}&${str}`);
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

   registration(
      login: string,
      nickname: string,
      password: string
   ): Promise<IUser | null> {
      const hash = SHA256(login + password).toString();
      return this.request("registration", { login, nickname, hash });
   }

   login(login: string, password: string): Promise<IUser | null> {
      const rnd = Math.random();
      const hash = SHA256(SHA256(login + password).toString() + rnd).toString();
      return this.request("login", { login, hash, rnd });
   }

   logout(login: string, token: string): Promise<true | null> {
      return this.request("logout", { token, login });
   }

   tokenVerification(login: string, token: string): Promise<true | null> {
      token = SHA256(token).toString();
      return this.request("tokenVerification", { login, token });
   }

   getAllInfo(login: string, token: string): Promise<IUserInfo | null> {
      return this.request("getAllInfo", { login, token });
   }

   updatePassword(
      login: string,
      token: string,
      newPassword: string
   ): Promise<true | null> {
      const hash = SHA256(login + newPassword).toString();
      return this.request("updatePassword", { login, token, hash });
   }
}
