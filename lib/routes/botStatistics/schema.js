import S from 'fluent-json-schema';

const addVisit = {
  tags: ['bot-statistics'],
  body: S.object()
    .prop('userAgent', S.string().required()),
  description: 'incr visit',
  // response: {
  //   200: S.object()
  //     .prop(
  //       'result',
  //       S.boolean(),
  //     ),
  // },
};

export default {
  addVisit,
};
