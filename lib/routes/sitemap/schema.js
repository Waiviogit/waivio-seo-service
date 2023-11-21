import S from 'fluent-json-schema';

const getSitemap = {
  tags: ['sitemap'],
  query: S.object()
    .prop('host', S.string().required())
    .prop('name', S.string().required()),
  description: 'Get sitemap',
  response: {
    200: S.string(),
  },
};

const deleteSitemap = {
  tags: ['sitemap'],
  body: S.object()
    .prop('host', S.string().required()),
  description: 'Delete sitemap',
  response: {
    200: S.object()
      .prop(
        'result',
        S.object()
          .prop('acknowledged', S.boolean())
          .prop('deletedCount', S.number()),
      ),
  },
};

const createSitemap = {
  tags: ['sitemap'],
  body: S.object()
    .prop('host', S.string().required()),
  description: 'Create sitemap',
  response: {
    200: S.string(),
  },
};

export default {
  getSitemap,
  deleteSitemap,
  createSitemap,
};
