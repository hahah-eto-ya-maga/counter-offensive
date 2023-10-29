import { SHA256 } from "crypto-js";
import { IError, IUserInfo, IUser } from "./types";

export default class Server {
   HOST: string;

   constructor(HOST: string) {
      this.HOST = HOST;
   }

   async request<T>(
      method: string,
      params: { [key: string]: any }
   ): Promise<T | IError> {
      if (method) {
         try {
            const url = `${this.HOST}/?method=${method}&${Object.keys(params)
               .map((key) => `${key}=${params[key]}`)
               .join("&")}`;
            const res = await fetch(url);
            const answer = await res.json();

            if (answer.result === "ok") {
               return answer.data as T;
            }
            return answer.error;
         } catch (e) {
            return {
               code: 500,
               text: "wtf",
            };
         }
      }
      return {
         code: 500,
         text: "wtf",
      };
   }

   registration(login: string, password: string): Promise<IUser | IError> {
      const hash = SHA256(login + password).toString();
      return this.request("registration", { login, hash });
   }

   login(login: string, password: string): Promise<IUser | IError> {
      const rnd = Math.random();
      const hash = SHA256(SHA256(login + password).toString() + rnd).toString();
      return this.request("login", { login, hash, rnd });
   }

   logout(login: string, token: string): Promise<true | IError> {
      token = SHA256(token).toString();
      return this.request("logout", { token, login });
   }

   tokenVerification(login: string, token: string): Promise<true | IError> {
      token = SHA256(token).toString();
      return this.request("tokenVerification", { login, token });
   }

   getAllInfo(login: string, token: string): Promise<IUserInfo | IError> {
      token = SHA256(token).toString();
      return this.request("getAllInfo", { login, token });
   }

   updatePassword(
      login: string,
      token: string,
      newPassword: string
   ): Promise<true | IError> {
      const hash = SHA256(login + newPassword).toString();
      token = SHA256(token).toString();
      return this.request("updatePassword", { login, token, hash });
   }
}
