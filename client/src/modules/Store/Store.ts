export enum EHash {
   lobbyHash = "lobbyHash",
   bulletHash = "bulletHash",
   gameHash = "gameHash",
   chatHash = "chatHash",
}

interface IHash {
   lobbyHash: string | null;
   bulletHash: string | null;
   gameHash: string | null;
   chatHash: string | null;
}

export default class Store {
   hash: IHash;
   token: string | null;

   constructor() {
      this.hash = {
         bulletHash: null,
         chatHash: null,
         gameHash: null,
         lobbyHash: null,
      };
      this.token = null;
   }

   getHash(type: EHash): string | null {
      return this.hash[type];
   }

   getToken(): string | null {
      return this.token;
   }

   setHash(type: EHash, hash: string | null) {
      this.hash[type] = hash;
   }

   setToken(token: string | null) {
      this.token = token;
   }
}
