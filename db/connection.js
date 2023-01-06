const { Pool } = require("pg");
const path = require("path");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

if (!process.env.DBNAME && !process.env.DBHOST) {
  throw new Error("DBNAME or DBHOST not set");
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DBHOST,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

module.exports = new Pool(config);
