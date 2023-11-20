import fp from 'fastify-plugin';
import schema from './schema.js';

async function product(fastify, opts) {
  const { productService } = fastify;

  fastify.route({
    method: 'POST',
    path: '/product',
    handler: onCreate,
    schema: schema.createProduct,
  });

  async function onCreate(req, reply) {
    const newProduct = await productService.create(req.body);
    console.log();
    return newProduct;
  }
}

export default fp(product);
