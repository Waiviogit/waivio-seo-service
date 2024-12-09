import fp from 'fastify-plugin';
import { GetObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import _ from 'lodash';

async function cachePageService(fastify, options, next) {
  const { dbModels, s3, redis } = fastify;

  const deleteCachedPages = async ({ host }) => {
    if (process.env.NODE_ENV !== 'production') {
      fastify.log.info(`deleteCachedPages FAILURE for ${host} NODE_ENV !== 'production'`);
      return { result: false };
    }
    try {
      const objects = [{ Key: host }, { Key: `${host}/` }];

      const urls = await redis.client2.SMEMBERS(`sitemap_set:${host}`);

      if (urls && urls.length) {
        const pagesToDelete = urls.map((el) => ({ Key: el.replace('https://', '') }));
        objects.push(...pagesToDelete);
      }

      const dataToDelete = _.chunk(objects, 500);
      await redis.client10.SET('api_seo_lock_pages', 'ok');

      for (const dataToDeleteElement of dataToDelete) {
        const command = new DeleteObjectsCommand({
          Bucket: process.env.CACHE_PAGE_BUCKET,
          Delete: {
            Objects: dataToDeleteElement,
          },
        });

        await s3.send(command);
      }

      await redis.client10.DEL(`api_res_cache:getAppFromCache:${host}`);
      await redis.client10.DEL(`api_res_cache:getSiteSettings:${host}`);
      await redis.client10.DEL(`ad_sense_cache:${host}`);
      await redis.client10.DEL('api_seo_lock_pages');

      fastify.log.info(`deleteCachedPages SUCCESS for ${host}`);

      return { result: true };
    } catch (error) {
      fastify.log.info(`deleteCachedPages FAILURE for ${host}`);
      fastify.log.info(error);
      await redis.client10.DEL('api_seo_lock_pages');
      return { result: false };
    }
  };

  const deleteAllObjectsFromBucket = async () => {
    try {
      console.log(`Starting to delete all objects from bucket: ${process.env.CACHE_PAGE_BUCKET}`);

      let isTruncated = true;
      let continuationToken;

      let countDeleted = 0;

      while (isTruncated) {
        // List objects in the bucket
        const listParams = {
          Bucket: process.env.CACHE_PAGE_BUCKET,
          ContinuationToken: continuationToken,
        };

        const listObjectsResponse = await s3.send(new ListObjectsV2Command(listParams));

        const objects = listObjectsResponse.Contents;

        if (!objects || objects.length === 0) {
          console.log('No objects found in the bucket.');
          break;
        }

        // Prepare delete parameters
        const deleteParams = {
          Bucket: process.env.CACHE_PAGE_BUCKET,
          Delete: {
            Objects: objects.map((obj) => ({ Key: obj.Key })),
          },
        };

        // Delete objects in chunks (max 1000 objects per request)
        console.log(`Deleting ${deleteParams.Delete.Objects.length} objects...`);
        await s3.send(new DeleteObjectsCommand(deleteParams));

        // Check if more objects need to be deleted
        isTruncated = listObjectsResponse.IsTruncated;
        continuationToken = listObjectsResponse.NextContinuationToken;
        countDeleted += deleteParams.Delete.Objects.length;
        console.log(`deleted ${countDeleted} objects`);
      }

      console.log('Successfully deleted all objects from the bucket.');
    } catch (error) {
      console.error('Error deleting objects from bucket:', error);
      throw error;
    }
  };

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
      const lock = await redis.client10.GET('api_seo_lock_pages');
      if (lock) return { result: false };

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
    deleteCachedPages,
    deleteAllObjectsFromBucket,
  });

  next();
}

export default fp(cachePageService);
