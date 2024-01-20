// dev

/* const PORT = 81;
const DOMAIN = 'http://counter-offensive'; */

//prod

const PORT = null;
const DOMAIN = "http://counter-offensive/server/public";

export const HOST = PORT ? `${DOMAIN}:${PORT}` : DOMAIN;

export const MEDIATOR = {
    EVENTS: {
        SERVER_ERROR: "SERVER_ERROR",
    },
    TRIGGERS: {
        WARNING: "WARNING",
        LOGIN: "LOGIN",
        LOGOUT: "LOGOUT",
        AUTH_ERROR: "AUTH_ERROR",
        ROLE_ERROR: "ROLE_ERROR",
        THROW_TO_GAME: "THROW_TO_GAME",
        THROW_TO_LOBBY: "THROW_TO_LOBBY",
        UPDATE_TIME: "UPDATE_TIME",
    },
};

export const MAP_SIZE = {
    width: 150,
    height: 120,
};

export const requestDelay = {
    chat: 2000,
    lobby: 300,
    game: 150,
    gamerUpdate: 150,
};

export const entitiesConfig = {
    infantry: {
        speed: 0.004,
        r: 0.35,
        weaponLength: 0.6,
    },

    infantryRGP: {
        speed: 0.003,
        r: 0.35,
        weaponLength: 0.6,
    },

    middleTank: {
        weaponLength: 1,
        speed: 0.005,
        corpusR: 1,
        towerR: 0,
        rotateSpeed: (Math.PI / 180) * 0.04,
        rotateTowerSpeed: (Math.PI / 180) * 0.04,
    },

    heavyTank: {
        weaponLength: 1,
        speed: 0.004,
        corpusR: 1.2,
        towerR: 0,
        rotateSpeed: (Math.PI / 180) * 0.035,
        rotateTowerSpeed: (Math.PI / 180) * 0.04,
    },

    bannerman: {
        speed: 0.006,
        r: 0.35,
    },

    general: {
        speed: 0.06,
    },

    bulletSpeed: 0.1,
};

export const objectConf = {
    stoneR: 1,
};

export const WINConf = {
    width: 15,
    height: 15,
};

export const walls = [
    [
        { x: -1, y: -1 },
        { x: -1, y: MAP_SIZE.height + 1 },
        { x: 0, y: MAP_SIZE.height + 1 },
        { x: 0, y: -1 },
    ],
    [
        { x: -1, y: -1 },
        { x: -1, y: 0 },
        { x: MAP_SIZE.width, y: 0 },
        { x: MAP_SIZE.width, y: -1 },
    ],
    [
        { x: MAP_SIZE.width, y: -1 },
        { x: MAP_SIZE.width, y: MAP_SIZE.height + 1 },
        { x: MAP_SIZE.width + 1, y: MAP_SIZE.height + 1 },
        { x: MAP_SIZE.width + 1, y: -1 },
    ],
    [
        { x: 0, y: MAP_SIZE.height },
        { x: 0, y: MAP_SIZE.height + 1 },
        { x: MAP_SIZE.width, y: MAP_SIZE.height + 1 },
        { x: MAP_SIZE.width, y: MAP_SIZE.height },
    ],
];
