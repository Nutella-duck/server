const dotenv = require("dotenv");
const path = require("path");
const env = require("./properties/Config.json");

let configData =
  env.local.trim() == "development"
    ? require("./properties/LocalConfig.json")
    : require("./properties/ServerConfig.json");

dotenv.config({ path: path.join(__dirname, configData.dir) });

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './db/migrations',
      tableName: "nutellaMigrations",
    },
    seeds: {
      directory: './db/seeds'
    },
  },
};
