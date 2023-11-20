import AutoLoad from '@fastify/autoload';
import Sensible from '@fastify/sensible';
import Env from '@fastify/env';
import Cors from '@fastify/cors';
import UnderPressure from '@fastify/under-pressure';
import S from 'fluent-json-schema';
import { join } from 'desm';

/**
 * This is the entry point of our application. As everything in Fastify is a plugin.
 * The main reason why the entry point is a plugin as well is that we can easily
 * import it in our testing suite and add this application as a subcomponent
 * of another Fastify application. The encapsulaton system, of Fastify will make sure
 * that you are not leaking dependencies and business logic.
 * For more info, see https://www.fastify.io/docs/latest/Encapsulation/
 */
export default async function (fastify, opts) {
  // The `fastify-env` plugin will expose those configuration
  // under `fastify.config` and validate those at startup.
  await fastify.register(Env, {
    schema: S.object()
      .prop('NODE_ENV', S.string().required())
      .valueOf(),
  });

  // `fastify-sensible` adds many  small utilities, such as nice http errors.
  await fastify.register(Sensible);

  await fastify.register(UnderPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98,
  });

  await fastify.register(Cors, {
    origin: false,
  });
  // mongo swagger redis
  await fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'plugins'),
    options: { ...opts },
  });
  // mongo models
  await fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'models'),
    options: { ...opts },
  });

  await fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'services'),
    dirNameRoutePrefix: false,
    options: { ...opts },
  });

  await fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'routes'),
    dirNameRoutePrefix: false,
    options: { ...opts },
  });
}
