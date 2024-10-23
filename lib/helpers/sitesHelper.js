import { SITE_OBJECT_PREFIX } from '../constants/sitemap.js';

export const getIndexFromHostName = ({ prefix = SITE_OBJECT_PREFIX, host }) => {
  const cleanedHostName = host.replace(/\./g, '_');

  return `${prefix}${cleanedHostName}`;
};

export const isNamespaceValid = ({ dbName, collectionName }) => {
  const namespace = `${dbName}.${collectionName}`;
  const namespaceLength = Buffer.byteLength(namespace, 'utf8');
  return namespaceLength <= 120;
};
