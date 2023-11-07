// dev
const PORT = 81;
const DOMAIN = 'http://ivt21';

// prod
// const PORT = null;
// const DOMAIN = 'http://server';

export const HOST = PORT ? `${DOMAIN}:${PORT}` : DOMAIN;