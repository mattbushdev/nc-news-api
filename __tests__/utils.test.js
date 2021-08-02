const { formatTopicsData } = require("../db/utils/data-manipulation");

describe("formatTopicsData", () => {
  test("should return an nested array when passed an array of objects", () => {
    let input = [
      { description: "Code is love, code is life", slug: "coding" },
      { description: "FOOTIE!", slug: "football" },
    ];

    let result = formatTopicsData(input);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([
      ["coding", "Code is love, code is life"],
      ["football", "FOOTIE!"],
    ]);
  });
  test("should return nested array when passed empty array", () => {
    let input = [];

    let result = formatTopicsData(input);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });
  test("should return arrays with 2 nested elements", () => {
    let input = [
      { description: "Code is love, code is life", slug: "coding" },
      { description: "FOOTIE!", slug: "football" },
    ];
    expect(formatTopicsData(input)[0]).toHaveLength(2);
  });
});
