import S from 'fluent-json-schema';

const checkUserAgent = {
  tags: ['user-agent'],
  query: S.object()
    .prop('userAgent', S.string().required()),
  description: 'checks user agent',
  // response: {
  //   200: S.object()
  //     .prop(
  //       'result',
  //       S.boolean(),
  //     ),
  // },
};

export default {
  checkUserAgent,
};
