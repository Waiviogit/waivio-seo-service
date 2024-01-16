import app from './app.js';
import wobject from './wobject.js';
import post from './post.js';
import user from './user.js';

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
  {
    schema: post,
    name: 'posts',
    collection: 'posts',
  },
  {
    schema: user,
    name: 'users',
    collection: 'users',
  },
];

export default schemas;
