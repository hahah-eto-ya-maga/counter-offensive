import { EHash, IUserInfo } from "../Server/interfaces";

interface IHash {
    lobby: string | null;
    chat: string | null;
    bullets: string | null;
    gamers: string | null;
    mobs: string | null;
    map: string | null;
    bodies: string | null;

}

export default class Store {
    hash: IHash;
    user: IUserInfo | null;

    constructor() {
        this.hash = {
            bullets: null,
            chat: null,
            gamers: null,
            lobby: null,
            mobs: null,
            map: null,
            bodies: null,
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

    clearHash() {
        this.hash = {
            bullets: null,
            chat: null,
            gamers: null,
            lobby: null,
            map: null,
            mobs: null,
            bodies: null,
        };
    }
}
