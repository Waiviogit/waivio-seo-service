const createSitemapsCLI = require('./createSitemaps');

(async () => {
  await createSitemapsCLI.create();
  process.exit();
})();
