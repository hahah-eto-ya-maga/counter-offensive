// dev

/* const PORT = 81;
const DOMAIN = 'http://counter-offen'; */

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
   },
};
