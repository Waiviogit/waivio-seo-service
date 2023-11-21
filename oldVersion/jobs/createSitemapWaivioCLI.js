const createSitemapWaivio = require('./createSitemapWaivio');

(async () => {
  await createSitemapWaivio.create();
  process.exit();
})();
