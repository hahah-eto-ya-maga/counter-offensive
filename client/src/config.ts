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
      LOGIN: "LOGIN",
   },
   TRIGGERS: {
      // LOG & REG ERRORS
      WARNING: "WARNING",
      ERROR: "ERROR",
   },
};
