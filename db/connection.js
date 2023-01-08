const { Pool } = require("pg");
const path = require("path");
const { logger } = require("../app");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

if (!process.env.DBNAME && !process.env.DB_CONNECTION_STRING) {
  throw new Error("DBNAME or DB_CONNECTION_STRING not set");
}

const config =
  ENV === "production"
    ? {
        user: process.env.DBUSER,
        name: process.env.DBNAME,
        host: process.env.DBHOST,
        password: process.env.DBPASS,
        connectionString: process.env.DB_CONNECTION_STRING,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

const pool = new Pool(config);
logger.info(
  `Connection set with ${ENV} config for database:"${DBNAME}". Total pool count = ${pool.totalCount}`
);

module.exports = pool;
