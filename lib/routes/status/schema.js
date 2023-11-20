import S from 'fluent-json-schema';

const getStatus = {
  description: 'Returns status and version of the application',
  response: {
    200: S.object()
      .prop('status', S.string())
      .prop('version', S.string()),
  },
};

export default {
  getStatus,
};
