import S from 'fluent-json-schema';

const createPage = {
  tags: ['cache-page'],
  body: S.object()
    .prop('url', S.string().required())
    .prop('page', S.string().required()),
  description: 'create page cache',
  // response: {
  //   200: S.object()
  //     .prop(
  //       'result',
  //       S.boolean(),
  //     ),
  // },
};

const getPage = {
  tags: ['cache-page'],
  query: S.object()
    .prop('url', S.string().required()),
  description: 'get page cache',
  // response: {
  //   200: S.string(),
  // },
};

const getAppAds = {
  tags: ['cache-page'],
  query: S.object()
    .prop('host', S.string().required()),
  description: 'get app ads',
  // response: {
  //   200: S.string(),
  // },
};

const deletePages = {
  tags: ['cache-page'],
  body: S.object()
    .prop('host', S.string().required()),
  description: 'delete pages',
};

export default {
  createPage,
  getPage,
  getAppAds,
  deletePages,
};
