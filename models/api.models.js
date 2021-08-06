const fs = require("fs/promises");

exports.readEndpoints = async () => {
  const endpoints = await fs.readFile("./endpoints.json", "utf8");
  return JSON.parse(endpoints);
};
