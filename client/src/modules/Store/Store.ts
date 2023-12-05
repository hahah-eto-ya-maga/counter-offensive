export default class Store {
   token: string | null;
   lobbyHash: string | null;
   bulletHash: string | null;
   gameHash: string | null;

   constructor() {
      this.token = localStorage.getItem("token") ?? null;
      this.lobbyHash = null;
      this.bulletHash = null;
      this.gameHash = null;
   }
}
