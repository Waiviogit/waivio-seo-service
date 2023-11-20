import S from 'fluent-json-schema';

const createProduct = {
  tags: ['product'],
  body: S.object()
    .prop('name', S.string().required())
    .prop('description', S.string()),
  description: 'Create product',
  response: {
    200: S.object()
      .prop('name', S.string())
      .prop('description', S.string())
      .prop('id', S.number()),
  },
};

export default {
  createProduct,
};
