const { formatTopicData } = require("../db/utils/data-manipulation");

describe("formatTopicData", () => {
  test("should return a nested array when passed empty array", () => {
    expect(formatTopicData([])).toEqual([]);
  });
  test("should return an nested array when passed an array of object", () => {
    const topics = [{ description: "FOOTIE!", slug: "football" }];
    expect(Array.isArray(formatTopicData(topics))).toBe(true);
    expect(formatTopicData(topics)).toEqual([["football", "FOOTIE!"]]);
  });
  test("nested array should have slug key value at position 0 followed by description key value at position 1", () => {
    const topics = [
      { description: "Code is love, code is life", slug: "coding" },
      { description: "FOOTIE!", slug: "football" },
    ];
    expect(formatTopicData(topics)[0]).not.toEqual(topics[0]);
  });
  test("should return an array with multiple nested arrays when passed array of objects", () => {
    const topics = [
      { description: "Code is love, code is life", slug: "coding" },
      { description: "FOOTIE!", slug: "football" },
    ];
    expect(formatTopicData(topics)).toEqual([
      ["coding", "Code is love, code is life"],
      ["football", "FOOTIE!"],
    ]);
    expect(formatTopicData(topics)).toHaveLength(2);
  });
});
