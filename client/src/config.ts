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
   width: 75,
   height: 60,
};
export const requestDelay = {
   chat: 300,
   lobby: 150,
   game: 200,
};
