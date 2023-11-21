import app from './app.js';
import wobject from './wobject.js';

const schemas = [
  {
    schema: app,
    name: 'apps',
    collection: 'apps',
  },
  {
    schema: wobject,
    name: 'wobject',
    collection: 'wobjects',
  },
];

export default schemas;
