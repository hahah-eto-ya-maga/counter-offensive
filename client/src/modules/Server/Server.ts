import { SHA256 } from "crypto-js";
import { IError, IUserResponse } from "./types";

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
            const url = `${this.HOST}?method=${method}&${Object.keys(params)
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

   registration(
      login: string,
      password: string
   ): Promise<IUserResponse | IError> {
      const hash = SHA256(login + password).toString();
      return this.request("registration", { login, hash });
   }

   login(login: string, password: string): Promise<IUserResponse | IError> {
      const rnd = Math.random().toString();
      const hash = SHA256(SHA256(login + password).toString() + rnd).toString();
      return this.request("login", { login, hash, rnd });
   }

   logout(login: string, token: string): Promise<boolean | IError> {
      return this.request("logout", { token, login });
   }

   tokenVerification(login: string, token: string): Promise<boolean | IError> {
      return this.request("tokenVerification", { login, token });
   }

   getAllInfo(login: string, token: string): Promise<IUserResponse | IError> {
      return this.request("getAllInfo", { login, token });
   }

   updatePassword(
      login: string,
      token: string,
      newPassword: string
   ): Promise<boolean | IError> {
      const hash = SHA256(login + newPassword).toString();
      return this.request("updatePassword", { login, token, hash });
   }
}
