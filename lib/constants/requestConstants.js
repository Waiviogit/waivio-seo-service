exports.WAIVIO_API = {
  production: {
    HOST: 'https://www.waivio.com',
    BASE_URL: '/api',
    WOBJECTS: '/wobjects',
    WOBJECT: '/wobject',
    LIST_ITEM_LINKS: '/list-item-links',
    LIST_ITEM_DEPARTMENTS: '/list-item-departments',
  },
  staging: {
    HOST: 'https://waiviodev.com',
    BASE_URL: '/api',
    WOBJECTS: '/wobjects',
    WOBJECT: '/wobject',
    LIST_ITEM_LINKS: '/list-item-links',
    LIST_ITEM_DEPARTMENTS: '/list-item-departments',
  },
  development: {
    HOST: 'http://localhost:3000',
    BASE_URL: '/api',
    WOBJECTS: '/wobjects',
    WOBJECT: '/wobject',
    LIST_ITEM_LINKS: '/list-item-links',
    LIST_ITEM_DEPARTMENTS: '/list-item-departments',
  },
};
