import fp from 'fastify-plugin';

async function sitemapService(fastify, options, next) {
    const { sitemapModel } = fastify;



    fastify.decorate('sitemapService', {

    });

    next();
}

export default fp(sitemapService);
