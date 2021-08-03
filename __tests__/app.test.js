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
  test.only("200 - returns the specified article object", async () => {
    const response = await request(app).get("/api/articles/1").expect(200);
    expect(response.body.article).toEqual({
      article_id: 1,
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      title: "Living in the shadow of a great man",
      topic: "mitch",
      votes: 100,
    });
  });
});
