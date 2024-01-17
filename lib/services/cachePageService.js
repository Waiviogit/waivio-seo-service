import fp from 'fastify-plugin';
import { GetObjectCommand } from '@aws-sdk/client-s3';

async function cachePageService(fastify, options, next) {
  const { dbModels, s3 } = fastify;

  const getPageByUrl = async ({ url }) => {
    if (process.env.NODE_ENV !== 'production') return '';
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.CACHE_PAGE_BUCKET,
        Key: url,
      });

      const response = await s3.send(command);
      const page = await response.Body.transformToString();

      return page;
    } catch (error) {
      return '';
    }
  };

  const createPage = async ({ url, page }) => {
    if (process.env.NODE_ENV !== 'production') return { result: false };
    try {
      await s3.putObject({
        Body: page,
        Key: url,
        Bucket: process.env.CACHE_PAGE_BUCKET,
        ContentType: 'text/html',
      });
      return { result: true };
    } catch (error) {
      return { result: false };
    }
  };

  const getAppAddsByHost = async ({ host }) => dbModels.appModel.getAppAddsByHost(host);

  fastify.decorate('cachePageService', {
    getPageByUrl,
    createPage,
    getAppAddsByHost,
  });

  next();
}

export default fp(cachePageService);
