import { IError, IUserData } from "./types";

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
        const url = `${this.HOST}?${Object.keys(params)
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

  login(login: string, password: string): Promise<IUserData | IError> {
    return this.request<IUserData>("login", { login, password });
  }

  logout(login: string): Promise<IUserData | IError> {
    return this.request<IUserData>("logout", { login });
  }
}
