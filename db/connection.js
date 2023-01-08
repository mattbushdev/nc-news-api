const { Pool } = require("pg");
const path = require("path");
const loggerInstance = require("../logger");

const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

const logger = loggerInstance.newLogger("connection");

const dbName = process.env.DBNAME;
const dbConnectionString = process.env.DB_CONNECTION_STRING;

if (!dbName && !dbConnectionString) {
  throw new Error("DBNAME or DB_CONNECTION_STRING not set");
}

const config =
  ENV === "production"
    ? {
        user: process.env.DBUSER,
        name: dbName,
        host: process.env.DBHOST,
        password: process.env.DBPASS,
        connectionString: dbConnectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

const db = new Pool(config);
logger.info(
  `Connection set with ${ENV} config for database:"${dbName}". Total pool count = ${db.totalCount}`
);

module.exports = { db, logger };
