import fp from 'fastify-plugin';
import { S3 } from '@aws-sdk/client-s3';

async function fastifyS3(fastify, options, next) {
  try {
    const s3 = new S3({
      forcePathStyle: false,
      endpoint: 'https://nyc3.digitaloceanspaces.com',
      region: 'nyc3',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    fastify.decorate('s3', s3);

    next();
  } catch (err) {
    next(err);
  }
}

export default fp(fastifyS3, { name: 'fastifyS3' });
