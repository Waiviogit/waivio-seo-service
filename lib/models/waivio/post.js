function PostModel({ waivioDb }) {
  const Post = waivioDb.models.posts;
  const findOneFirstByAuthor = async ({ author }) => {
    try {
      return {
        result: await Post.findOne({ author }, {}, { sort: { createdAt: 1 } }).lean(),
      };
    } catch (error) {
      return { error };
    }
  };

  return {
    findOneFirstByAuthor,
  };
}

export default PostModel;
