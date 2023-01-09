const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const { db, logger } = require("../connection.js");

const runSeed = async () => {
  try {
    logger.info("Running seed.");

    await seed(devData);

    logger.info("Seed complete, ending connection.");
  } catch (err) {
    logger.error(err);
  }
};

runSeed();
