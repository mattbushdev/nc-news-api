exports.formatTopicData = (topicData) => {
  return topicData.map((topic) => {
    return [topic.slug, topic.description];
  });
};

exports.formatUserData = (userData) => {
  return userData.map((user) => {
    return [user.username, user.avatar_url, user.name];
  });
};

exports.formatArticleData = (articleData) => {
  return articleData.map((article) => {
    return [
      article.title,
      article.body,
      article.votes,
      article.topic,
      article.author,
      article.created_at,
    ];
  });
};

exports.formatCommentData = (commentData, articleDataResult) => {
  return commentData.map((comment) => {
    let article_id = 0;
    articleDataResult.forEach((article) => {
      if (comment.belongs_to === article.title) {
        article_id = article.article_id;
      }
    });
    return [
      comment.created_by,
      article_id,
      comment.votes,
      comment.created_at,
      comment.body,
    ];
  });
};
