import { EHash, IUserInfo } from "../Server/interfaces";

interface IHash {
   lobbyHash: string | null;
   bulletHash: string | null;
   gameHash: string | null;
   chatHash: string | null;
}

export default class Store {
   hash: IHash;
   user: IUserInfo | null;

   constructor() {
      this.hash = {
         bulletHash: null,
         chatHash: null,
         gameHash: null,
         lobbyHash: null,
      };
      this.user = null;
   }

   getHash(type: EHash): string | null {
      return this.hash[type];
   }

   getToken(): string | null {
      return this.user ? this.user.token : null;
   }

   setHash(type: EHash, hash: string | null) {
      this.hash[type] = hash;
   }

   setToken(token: string | null) {
      if (this.user) {
         this.user.token = token;
      }
   }
}
