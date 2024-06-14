import envSchema from 'env-schema';
import S from 'fluent-json-schema';
import waivioSchemes from './schema/waivio/index.js';
import seoSchemes from './schema/seo-bot/index.js';

async function getConfig() {
  const env = envSchema({
    dotenv: true,
    schema: S.object()
      .prop('NODE_ENV', S.string().required())
      .prop('API_HOST', S.string().required())
      .prop('API_PORT', S.string().required())
      .prop('API_PREFIX', S.string().required())
      .prop(
        'LOG_LEVEL',
        S.string()
          .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
          .default('info'),
      )
      .prop('JWT_SECRET', S.string().required())
      .prop('JWT_EXPIRES_IN', S.string().required())
      .prop('JWT_ISSUER', S.string().required())
      .prop('MONGO_URI_WAIVIO', S.string().required())
      .prop('MONGO_URI_SEO', S.string().required())
      .prop('REDIS_CONNECTION', S.string().required())
      .prop('HASH_SALT_ROUNDS', S.number().default(10)),
  });

  const config = {
    prefix: env.API_PREFIX,
    fastify: {
      host: env.API_HOST,
      port: env.API_PORT,
    },
    fastifyInit: {
      // trustProxy: 2,
      // disableRequestLogging: true,
      logger: {
        level: env.LOG_LEVEL,
        serializers: {
          req: (request) => ({
            method: request.raw.method,
            url: request.raw.url,
            hostname: request.hostname,
          }),
          res: (response) => ({
            statusCode: response.statusCode,
          }),
        },
      },
    },
    bodyLimit: 1048576 * 5, // 5 mb
    security: {
      jwtSecret: env.JWT_SECRET,
      jwtExpiresIn: env.JWT_EXPIRES_IN,
      jwtIssuer: env.JWT_ISSUER,
      hashSaltRounds: env.HASH_SALT_ROUNDS,
    },
    mongo: {
      waivio: {
        uri: env.MONGO_URI_WAIVIO,
        schemes: waivioSchemes,
      },
      seo: {
        uri: env.MONGO_URI_SEO,
        schemes: seoSchemes,
      },
    },
    redis: {
      url: env.REDIS_CONNECTION,
    },
  };

  return config;
}

export default getConfig;
