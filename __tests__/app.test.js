const { db } = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const endpointsJSON = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET - /api", () => {
  test("200 - returns an object describing all the available endpoints of the API", async () => {
    const { body } = await request(app).get("/api").expect(200);
    expect(typeof body.endpoints).toBe("object");
    expect(body.endpoints).toEqual(endpointsJSON);
  });

  test("404 - responds with not found for wrong path", async () => {
    const { body } = await request(app).get("/invalidpath").expect(404);
    expect(body.message).toBe("invalid path");
  });
});

describe("GET - /api/topics", () => {
  test("200 - returns an array of topics", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    const { topics } = body;
    expect(topics.length).toBeGreaterThan(0);
    expect(topics).toHaveLength(3);
    topics.forEach((topic) => {
      expect(topic).toHaveProperty("slug");
      expect(topic).toHaveProperty("description");
    });
  });
});

describe("GET - /api/articles", () => {
  test("200 - returns an array of articles", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(Array.isArray(body.articles)).toEqual(true);
    expect(body.articles).toHaveLength(12);
  });

  test("200 - returns articles with correct properties", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    const { articles } = body;
    expect(articles.length).toBeGreaterThan(0);
    articles.forEach((article) => {
      expect(article).toHaveProperty("article_id");
      expect(article).toHaveProperty("author");
      expect(article).toHaveProperty("body");
      expect(article).toHaveProperty("created_at");
      expect(article).toHaveProperty("topic");
      expect(article).toHaveProperty("votes");
      expect(article).toHaveProperty("comment_count");
    });
  });

  test("200 - returns articles that are by default sorted by created_at in descending order", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
    expect(body.articles).toBeSortedBy("created_at", { descending: true });
  });

  test("200 - accepts sort_by query e.g. votes", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200);
    expect(body.articles[0].votes).toBe(100);
    expect(body.articles).toBeSortedBy("votes", { descending: true });
  });

  test("200 - accepts order as a query e.g.sort by author in ascending order", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200);
    expect(body.articles[0].author).toBe("butter_bridge");
    expect(body.articles).toBeSortedBy("author", { ascending: true });
  });

  test("200 - accepts topic as a query to filter articles e.g. filter topic by coding", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=cats")
      .expect(200);
    const { articles } = body;
    expect(articles.length).toBeGreaterThan(0);
    articles.every((article) => {
      expect(article.topic).toBe("cats");
    });
  });

  test("200 - accepts valid topic as query that has no articles and returns an empty array", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=paper")
      .expect(200);
    expect(body.articles).toEqual([]);
    expect(body.articles).toHaveLength(0);
  });

  test("400 - responds with bad request when sorting by an invalid column", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=name")
      .expect(400);
    expect(body.message).toBe("invalid sort by query");
  });

  test("400 - responds with bad request when ordering by an invalid input", async () => {
    const { body } = await request(app)
      .get("/api/articles?order=high")
      .expect(400);
    expect(body.message).toBe("invalid order query");
  });

  test("404 - responds with not found when filtering by an invalid topic", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=bananas")
      .expect(404);
    expect(body.message).toBe("topic bananas does not exist");
  });
});

describe("GET - /api/articles/:article_id", () => {
  test("200 - returns the specified article with a count of comments", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);
    expect(body.article).toEqual({
      article_id: 1,
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T21:11:00.000Z",
      title: "Living in the shadow of a great man",
      topic: "mitch",
      votes: 100,
      comment_count: "13",
    });
  });

  test("200 - returns the specified article with a count of 0 if no comments exist", async () => {
    const { body } = await request(app).get("/api/articles/2").expect(200);
    expect(body.article).toEqual({
      article_id: 2,
      title: "Sony Vaio; or, The Laptop",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      votes: 0,
      topic: "mitch",
      author: "icellusedkars",
      created_at: "2020-10-16T06:03:00.000Z",
      comment_count: "0",
    });
  });

  test("400 - responds with bad request for invalid article_id", async () => {
    const { body } = await request(app).get("/api/articles/cat").expect(400);
    expect(body.message).toBe("invalid input");
  });

  test("404 - responds with not found for non-existent article_id", async () => {
    const { body } = await request(app).get("/api/articles/12345").expect(404);
    expect(body.message).toBe("article id does not exist");
  });
});

describe("PATCH - /api/articles/:article_id", () => {
  test("200 - returns updated votes when passed a positive number", async () => {
    const updateVotes = {
      inc_votes: 1,
    };
    const { body } = await request(app)
      .patch("/api/articles/5")
      .send(updateVotes)
      .expect(200);
    expect(body.article).toEqual({
      article_id: 5,
      title: "UNCOVERED: catspiracy to bring down democracy",
      body: "Bastet walks amongst us, and the cats are taking arms!",
      votes: 1,
      topic: "cats",
      author: "rogersop",
      created_at: "2020-08-03T14:14:00.000Z",
    });
  });

  test("200 - returns updated votes when passed a negative number", async () => {
    const updateVotes = {
      inc_votes: -10,
    };
    const { body } = await request(app)
      .patch("/api/articles/5")
      .send(updateVotes)
      .expect(200);
    expect(body.article).toEqual({
      article_id: 5,
      title: "UNCOVERED: catspiracy to bring down democracy",
      body: "Bastet walks amongst us, and the cats are taking arms!",
      votes: -10,
      topic: "cats",
      author: "rogersop",
      created_at: "2020-08-03T14:14:00.000Z",
    });
  });

  test("400 - responds with bad request when inc_votes not included in request body", async () => {
    const updateVotes = {};
    const { body } = await request(app)
      .patch("/api/articles/5")
      .send(updateVotes)
      .expect(400);
    expect(body.message).toEqual("inc_votes not in request body");
  });

  test("400 - responds with bad request when inc_votes not included and other property passed in request body", async () => {
    const updateVotes = {
      author: "matt",
    };
    const { body } = await request(app)
      .patch("/api/articles/5")
      .send(updateVotes)
      .expect(400);
    expect(body.message).toEqual("inc_votes not in request body");
  });

  test("400 - responds with bad request when inc_votes value is not an integer", async () => {
    const updateVotes = {
      inc_votes: "1vote",
    };
    const { body } = await request(app)
      .patch("/api/articles/5")
      .send(updateVotes)
      .expect(400);
    expect(body.message).toEqual("invalid input");
  });

  test("400 - responds with bad request when inc_votes and other property passed in request body", async () => {
    const updateVotes = {
      inc_votes: 2,
      author: "matt",
    };
    const { body } = await request(app)
      .patch("/api/articles/5")
      .send(updateVotes)
      .expect(400);
    expect(body.message).toEqual("invalid property in request body");
  });

  test("404 - responds with not found for non-existent article_id", async () => {
    const { body } = await request(app).get("/api/articles/0").expect(404);
    expect(body.message).toBe("article id does not exist");
  });
});

describe("GET - /api/articles/:article_id/comments", () => {
  test("200 - returns an array of comments for the given article_id", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    const { comments } = body;
    expect(Array.isArray(body.comments)).toBe(true);
    expect(comments.length).toBeGreaterThan(0);
    expect(comments).toHaveLength(13);
    comments.forEach((comment) => {
      expect(comment).toHaveProperty("comment_id");
      expect(comment).toHaveProperty("votes");
      expect(comment).toHaveProperty("created_at");
      expect(comment).toHaveProperty("author");
      expect(comment).toHaveProperty("body");
      expect(comment).not.toHaveProperty("article_id");
    });
  });

  test("200 - returns an empty array for article with no comment", async () => {
    const { body } = await request(app)
      .get("/api/articles/3/comments")
      .expect(200);
    expect(body.comments).toEqual([]);
  });

  test("400 - responds with bad request for invalid article_id", async () => {
    const { body } = await request(app)
      .get("/api/articles/cat/comments")
      .expect(400);
    expect(body.message).toBe("invalid input");
  });

  test("404 - responds with not found for non-existent article_id", async () => {
    const { body } = await request(app)
      .get("/api/articles/12345/comments")
      .expect(404);
    expect(body.message).toBe("article id does not exist");
  });
});

describe("POST - /api/articles/:article_id/comments", () => {
  test("201 - returns a new comment for specified article", async () => {
    const postComment = {
      username: "icellusedkars",
      body: "not a particularly thrilling read",
    };
    const { body } = await request(app)
      .post("/api/articles/5/comments")
      .send(postComment)
      .expect(201);
    expect(body.comment).toMatchObject({
      article_id: 5,
      author: "icellusedkars",
      body: "not a particularly thrilling read",
      comment_id: 19,
      votes: 0,
    });
    expect(body.comment).toHaveProperty("created_at");
  });

  test("201 - returns a new comment for specified article and ignores additional properties", async () => {
    const postComment = {
      username: "icellusedkars",
      body: "not a particularly thrilling read",
      extraProp: "value to be ignored",
    };
    const { body } = await request(app)
      .post("/api/articles/5/comments")
      .send(postComment)
      .expect(201);
    expect(body.comment).toMatchObject({
      article_id: 5,
      author: "icellusedkars",
      body: "not a particularly thrilling read",
      comment_id: 19,
      votes: 0,
    });
    expect(body.comment).toHaveProperty("created_at");
  });

  test("400 - responds with bad request for a comment without a body property", async () => {
    const postComment = {
      username: "icellusedkars",
    };
    const { body } = await request(app)
      .post("/api/articles/5/comments")
      .send(postComment)
      .expect(400);
    expect(body.message).toBe("no username or body property in request body");
  });
  test("404 - responds with bad request for article_id that does not exist", async () => {
    const postComment = {
      username: "icellusedkars",
      body: "not a particularly thrilling read",
    };
    const { body } = await request(app)
      .post("/api/articles/12345/comments")
      .send(postComment)
      .expect(404);
    expect(body.message).toBe("article id does not exist");
  });
  test("404 - responds with bad request for a username that does not exist", async () => {
    const postComment = {
      username: "matt",
      body: "not a particularly thrilling read",
    };
    const { body } = await request(app)
      .post("/api/articles/5/comments")
      .send(postComment)
      .expect(404);
    expect(body.message).toBe("username: matt does not exist");
  });
});

describe("PATCH - /api/comments/:comment_id", () => {
  test("200 - returns updated votes on comment when passed a positive number", async () => {
    const updateVotes = {
      inc_votes: 1,
    };
    const { body } = await request(app)
      .patch("/api/comments/5")
      .send(updateVotes)
      .expect(200);
    expect(body.comment).toEqual({
      comment_id: 5,
      author: "icellusedkars",
      article_id: 1,
      votes: 1,
      created_at: "2020-11-03T21:00:00.000Z",
      body: "I hate streaming noses",
    });
  });

  test("200 - returns updated votes on comment when passed a negative number", async () => {
    const updateVotes = {
      inc_votes: -10,
    };
    const { body } = await request(app)
      .patch("/api/comments/2")
      .send(updateVotes)
      .expect(200);
    expect(body.comment).toEqual({
      comment_id: 2,
      author: "butter_bridge",
      article_id: 1,
      votes: 4,
      created_at: "2020-10-31T03:03:00.000Z",
      body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
    });
  });

  test("200 - ignores invalid properties on request body and returns updated votes", async () => {
    const updateVotes = {
      inc_votes: 1,
      author: "new-author",
    };
    const { body } = await request(app)
      .patch("/api/comments/5")
      .send(updateVotes)
      .expect(200);
    expect(body.comment).toEqual({
      comment_id: 5,
      author: "icellusedkars",
      article_id: 1,
      votes: 1,
      created_at: "2020-11-03T21:00:00.000Z",
      body: "I hate streaming noses",
    });
  });

  test("400 - responds with bad request for invalid comment_id", async () => {
    const updateVotes = {
      inc_votes: 1,
    };
    const { body } = await request(app)
      .patch("/api/comments/kitten")
      .send(updateVotes)
      .expect(400);
    expect(body.message).toBe("invalid input");
  });

  test("404 - responds with not found for non-existent comment_id", async () => {
    const updateVotes = {
      inc_votes: 1,
    };

    const { body } = await request(app)
      .patch("/api/comments/25")
      .send(updateVotes)
      .expect(404);
    expect(body.message).toBe("comment id does not exist");
  });
});

describe("DELETE - /api/comments/:comment_id", () => {
  test("204 - returns status code 204 and deletes comment by specified comment id", async () => {
    const { body } = await request(app).delete("/api/comments/18").expect(204);
  });

  test("400 - responds with bad request for invalid comment_id", async () => {
    const { body } = await request(app).delete("/api/comments/dog").expect(400);
    expect(body.message).toBe("invalid input");
  });

  test("404 - responds with not found for non-existent comment_id", async () => {
    const { body } = await request(app).delete("/api/comments/19").expect(404);
    expect(body.message).toBe("comment id does not exist");
  });
});

describe("GET - /api/users", () => {
  test("200 - returns an array of users", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    const { users } = body;
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users).toHaveLength(4);
    users.forEach((user) => {
      expect(user).toHaveProperty("username");
    });
  });
});

describe("GET - /api/users/:username", () => {
  test("200 - returns an object of the user by the specified username", async () => {
    const { body } = await request(app).get("/api/users/lurker").expect(200);
    expect(body.user).toEqual({
      username: "lurker",
      avatar_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      name: "do_nothing",
    });
  });

  test("404 - responds with not found for non-existent username", async () => {
    const { body } = await request(app).get("/api/users/bobby").expect(404);
    expect(body.message).toBe("username does not exist");
  });
});
