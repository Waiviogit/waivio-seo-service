const websocket = require('@fastify/websocket');

function init(server, routes) {
  server.register(websocket);
  server.register(async (server) => {
    server.get(
      '/seo-service',
      { websocket: true },
      (connection /* SocketStream */ /* req: FastifyRequest */) => {
        connection.socket.on('message', async (message) => {
          try {
            const {
              name, method, args = [], id = '1',
            } = JSON.parse(message);
            const handler = routes?.[name]?.[method];

            if (!handler) { return connection.send('"Not found"', { binary: false }); }

            server.log.info('args', JSON.stringify(args));
            server.log.info('name, method', name, method);
            // todo replace server to first place in all api calls + refactor mongo
            const data = await handler(...args, server);

            const response = JSON.stringify({ data, id });

            server.log.info('response', response);
            connection.socket.send(response, { binary: false });
          } catch (err) {
            server.log.error(err);
            connection.socket.send('"Server error"', { binary: false });
          }
        });
      },
    );
  });
}

module.exports = { init };
