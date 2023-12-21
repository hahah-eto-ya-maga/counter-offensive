// dev

/* const PORT = 81;
const DOMAIN = 'http://counter-offensive'; */

//prod

const PORT = null;
const DOMAIN = "http://localhost";

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
   },
};

export const MAP_SIZE = {
   width: 150,
   height: 120,
};
export const requestDelay = {
   chat: 300,
   lobby: 150,
   game: 2000,
   gamerUpdate: 10000,
};

export const entitiesConfig = {
   bulletSpeed: 1,
   mobSpeed: 0.2,
   gamerSpeed: 0.1,
};

// Карта статических объектов

const objectConf = {
   stoneR: 1,
};

export const staticObjects = {
   houses: [
      [
         { x: 8, y: 10 },
         { x: 8, y: 13 },
         { x: 14, y: 13 },
         { x: 14, y: 10 },
      ],
   ],
   walls: [
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
   ],
   stones: [
      { x: 16, y: 12, r: objectConf.stoneR },
      { x: 18, y: 10, r: objectConf.stoneR },
      { x: 6, y: 12, r: objectConf.stoneR },
   ],
};
