// dev

/* const PORT = 8080;
const DOMAIN = 'http://localhost'; */

const PORT = null;
const DOMAIN = "http://server/api";

// prod

/* const PORT = null;
const DOMAIN = 'http://localhost/api';  */

export const HOST = PORT ? `${DOMAIN}:${PORT}` : DOMAIN;
