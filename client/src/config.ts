// dev

/* const PORT = 81;
const DOMAIN = 'http://counter-nastup'; */

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
      TOKEN_UPDATE: "TOKEN_UPDATE",
   },
};

export const MAP_SIZE = {
   width: 75,
   height: 60,
};