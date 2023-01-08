const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const { pool, logger } = require("../connection.js");

const runSeed = () => {
  logger.info(`running seed... pool count = ${pool.totalCount}`);
  return seed(devData).then(() => pool.end());
};

runSeed();
