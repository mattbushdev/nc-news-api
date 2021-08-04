const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET - /api/topics", () => {
  test("200 - returns an array of topics", async () => {
    const response = await request(app).get("/api/topics").expect(200);
    expect(response.body.topics).toHaveLength(3);
  });
  test("200 - returns topics with the correct properties", async () => {
    const response = await request(app).get("/api/topics").expect(200);
    const { topics } = response.body;
    topics.forEach((topic) => {
      expect(topic).toHaveProperty("slug");
      expect(topic).toHaveProperty("description");
    });
  });
  test("404 - responds with not found for wrong path", async () => {
    const response = await request(app).get("/api/invalidpath").expect(404);
    expect(response.body.message).toBe("invalid path");
  });
});

describe("GET - /api/articles/:article_id", () => {
  test("200 - returns the specified article object with count of comments", async () => {
    const response = await request(app).get("/api/articles/1").expect(200);
    expect(response.body.article).toEqual({
      article_id: 1,
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      title: "Living in the shadow of a great man",
      topic: "mitch",
      votes: 100,
      comment_count: "13",
    });
  });
  test("200 - returns the specified article object with count of 0 if no comments exist", async () => {
    const response = await request(app).get("/api/articles/2").expect(200);
    expect(response.body.article).toEqual({
      article_id: 2,
      title: "Sony Vaio; or, The Laptop",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      votes: 0,
      topic: "mitch",
      author: "icellusedkars",
      created_at: "2020-10-16T05:03:00.000Z",
      comment_count: "0",
    });
  });
  test("400 - responds with bad request for invalid article_id", async () => {
    const response = await request(app).get("/api/articles/cat").expect(400);
    expect(response.body.message).toBe(
      'invalid input syntax for type integer: "cat"'
    );
  });
  test("404 - responds with not found for non-existent article_id", async () => {
    const response = await request(app).get("/api/articles/12345").expect(404);
    expect(response.body.message).toBe("article id does not exist");
  });
});

describe("PATCH - /api/articles/:article_id", () => {
  test("200 - returns patched article object", () => {
    const response = await request(app).patch("/api/articles/5").expect("200");
    expect(response.body.article).toBe({});
  });
});
