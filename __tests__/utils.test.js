const {
  formatTopicData,
  formatCommentData,
} = require("../db/utils/data-manipulation");
const { db } = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("formatTopicData", () => {
  test("return a nested array when passed empty array", () => {
    expect(formatTopicData([])).toEqual([]);
  });

  test("return a nested array of values in correct order from the passed object keys", () => {
    const topic = [{ description: "FOOTIE!", slug: "football" }];
    expect(Array.isArray(formatTopicData(topic))).toBe(true);
    expect(formatTopicData(topic)).toEqual([["football", "FOOTIE!"]]);
    expect(formatTopicData(topic)[0][0]).toBe(topic[0].slug);
    expect(formatTopicData(topic)[0][1]).toBe(topic[0].description);
  });

  test("does not mutate original data", () => {
    const topic = [{ description: "FOOTIE!", slug: "football" }];
    expect(formatTopicData(topic)).not.toBe(topic);
    expect(topic).toEqual([{ description: "FOOTIE!", slug: "football" }]);
  });

  test("return an array with multiple nested arrays when passed array of objects", () => {
    const topics = [
      { description: "Code is love, code is life", slug: "coding" },
      { description: "FOOTIE!", slug: "football" },
    ];
    expect(formatTopicData(topics)).toEqual([
      ["coding", "Code is love, code is life"],
      ["football", "FOOTIE!"],
    ]);
    expect(formatTopicData(topics)).toHaveLength(2);
    expect(formatTopicData(topics)[0][0]).toBe(topics[0].slug);
    expect(formatTopicData(topics)[0][1]).toBe(topics[0].description);
    expect(formatTopicData(topics)[1][0]).toBe(topics[1].slug);
    expect(formatTopicData(topics)[1][1]).toBe(topics[1].description);
  });
});

describe("formatCommentData", () => {
  test("return a nested array when passed empty array", () => {
    expect(formatCommentData([])).toEqual([]);
  });

  test("return a nested array of values in correct order from the passed object keys", async () => {
    const comment = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
    ];
    const { rows } = await db.query(`SELECT * FROM articles`);
    expect(formatCommentData(comment, rows)).toEqual([
      [
        "butter_bridge",
        9,
        16,
        new Date(1586179020000),
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      ],
    ]);
    expect(formatCommentData(comment, rows)[0][0]).toBe(comment[0].created_by);
    expect(formatCommentData(comment, rows)[0][2]).toBe(comment[0].votes);
    expect(formatCommentData(comment, rows)[0][3]).toBe(comment[0].created_at);
    expect(formatCommentData(comment, rows)[0][4]).toBe(comment[0].body);
  });

  test("does not mutate original data", async () => {
    const comment = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
    ];
    const { rows } = await db.query(`SELECT * FROM articles`);
    expect(formatCommentData(comment, rows)).not.toBe(comment);
  });

  test("return an array with multiple nested arrays when passed array of objects", async () => {
    const comment = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: new Date(1604113380000),
      },
    ];
    const { rows } = await db.query(`SELECT * FROM articles`);
    expect(formatCommentData(comment, rows)).toEqual([
      [
        "butter_bridge",
        9,
        16,
        new Date(1586179020000),
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      ],
      [
        "butter_bridge",
        1,
        14,
        new Date(1604113380000),
        "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
      ],
    ]);
  });
});
