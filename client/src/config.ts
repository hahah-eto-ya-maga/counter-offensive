// dev

/* const PORT = 8080;
const DOMAIN = 'http://localhost'; */

// prod

const PORT = null;
const DOMAIN = 'http://localhost/api'; 

export const HOST = PORT ? `${DOMAIN}:${PORT}` : DOMAIN;
