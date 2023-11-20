import { readFile } from 'fs/promises';
import { join } from 'desm';
import fp from 'fastify-plugin';
import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';

const { version } = JSON.parse(await readFile(join(import.meta.url, '../../package.json')));

async function swaggerGenerator(fastify, opts) {
  // Swagger documentation generator for Fastify.
  // It uses the schemas you declare in your routes to generate a swagger compliant doc.
  // https://github.com/fastify/fastify-swagger
  await fastify.register(Swagger, {
    swagger: {
      info: {
        title: 'Fastify URL Shortener',
        description: 'Fastify URL Shortener documentation',
        version,
      },
      externalDocs: {
        url: 'https://github.com/delvedor/fastify-example',
        description: 'Find more info here',
      },
      host: `localhost:${opts.fastify.port}`, // and your deployed url
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json', 'text/html'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Bearer',
          in: 'header',
        },
        Csrf: {
          type: 'apiKey',
          name: 'x-csrf-token',
          in: 'header',
        },
      },
    },
    exposeRoute: fastify.config.NODE_ENV !== 'production',
  });

  if (fastify.config.NODE_ENV !== 'production') {
    await fastify.register(SwaggerUI, {
      routePrefix: '/documentation',
    });
  }
}

export default fp(swaggerGenerator, {
  name: 'swaggerGenerator',
});
