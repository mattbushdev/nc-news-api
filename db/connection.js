const { Pool } = require("pg");
const path = require("path");
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

module.exports = new Pool(config);
