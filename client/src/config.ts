// dev

/* const PORT = 81;
const DOMAIN = 'http://ivt21'; */

//prod

const PORT = null;
const DOMAIN = "http://localhost/api";

export const HOST = PORT ? `${DOMAIN}:${PORT}` : DOMAIN;

export const MEDIATOR = {
    EVENTS: {
        SERVER_ERROR: 'SERVER_ERROR',
    },
    TRIGGERS: {
    }
};
