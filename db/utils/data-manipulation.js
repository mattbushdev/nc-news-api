const articles = require("../data/development-data/articles");

// extract any functions you are using to manipulate your data, into this file
const formatTopicsData = (topicData) => {
  return topicData.map(function (topic) {
    return [topic.slug, topic.description];
  });
};

const formatUsersData = (userData) => {
  return userData.map(function (user) {
    return [user.username, user.avatar_url, user.name];
  });
};
const formatArticleData = (articleData) => {
  return articleData.map(function (article) {
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
const formatCommentData = (commentData, articleInsertData) => {
  return commentData.map(function (comment) {
    let author = "";
    let article_id = 0;
    articleInsertData.forEach(function (article) {
      if (comment.belongs_to === article.title) {
        author = article.author;
        article_id = article.article_id;
      }
    });
    //console.log(author);
    return [
      author,
      article_id,
      comment.votes,
      comment.created_at,
      comment.body,
    ];
  });
};
module.exports = {
  formatTopicsData,
  formatUsersData,
  formatArticleData,
  formatCommentData,
};
