import { readFile } from 'fs/promises';
import { join } from 'desm';
import fp from 'fastify-plugin';
import schema from './schema.js';

const { version } = JSON.parse(await readFile(join(import.meta.url, '../../../package.json')));

async function status(fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/status',
    handler: onStatus,
    schema: schema.getStatus,
  });

  async function onStatus(req, reply) {
    return { status: 'ok', version };
  }
}

export default fp(status);
