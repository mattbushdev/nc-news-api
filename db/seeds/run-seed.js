const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");
const { logger } = require("../../app.js");

const runSeed = () => {
  logger.info(`running seed... pool count = ${db.totalCount}`);
  return seed(devData).then(() => db.end());
};

runSeed();
