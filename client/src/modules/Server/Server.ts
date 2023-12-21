import { SHA256 } from "crypto-js";
import Mediator from "../Mediator/Mediator";
import Store from "../Store/Store";
import {
   IUserInfo,
   IError,
   IMessages,
   EGamerRole,
   ILobbyState,
   EHash,
} from "./interfaces";

export default class Server {
   mediator: Mediator;
   HOST: string;
   STORE: Store;

   constructor(HOST: string, mediator: Mediator) {
      this.HOST = HOST;
      this.mediator = mediator;
      this.STORE = new Store();
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
      return this.request("logout", { token: this.STORE.getToken() });
   }

   updatePassword(login: string, newPassword: string): Promise<true | null> {
      const hash = SHA256(login + newPassword).toString();
      return this.request("updatePassword", {
         token: this.STORE.getToken(),
         hash,
      });
   }

   getMessages(): Promise<IMessages | true | null> {
      return this.request("getMessages", {
         token: this.STORE.getToken(),
         hash: this.STORE.getHash(EHash.chatHash),
      });
   }

   sendMessages(message: string): Promise<true | null> {
      return this.request("sendMessage", {
         token: this.STORE.getToken(),
         message,
      });
   }

   setGamerRole(
      role: EGamerRole,
      tankId: number | null = null
   ): Promise<true | null> {
      return this.request("setGamerRole", {
         token: this.STORE.getToken(),
         role,
         tankId,
      });
   }

   getLobby(): Promise<ILobbyState | true | null> {
      return this.request("getLobby", {
         token: this.STORE.getToken(),
         hash: this.STORE.getHash(EHash.lobbyHash),
      });
   }

   suicide(): Promise<true | null> {
      return this.request("suicide", {
         token: this.STORE.getToken(),
      });
   }
}
