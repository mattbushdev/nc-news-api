const { Pool } = require("pg");
const path = require("path");
const loggerInstance = require("../logger");

const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

const logger = loggerInstance.newLogger("connection");

const database = process.env.DBNAME;
const user = process.env.DBUSER;
const password = process.env.DBPASS;
const server = process.env.DBHOST;

if (!database && !server) {
  throw new Error("database name or server not set");
}

const connectionString = `postgres://${user}@${server}:${password}@${server}.postgres.database.azure.com:5432/${database}`;

const db = new Pool({
  connectionString: connectionString,
  ssl: true,
});

logger.info(
  `Connecting ${ENV} to ${database} database as ${user} on ${server}:5432. Total pool count = ${db.totalCount}`
);

module.exports = { db, logger };
