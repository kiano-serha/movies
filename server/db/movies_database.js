const mysql2 = require("mysql2/promise");
require("dotenv").config();

const db_connection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "movies",
  port: "21948",
  connectionLimit: 100,
});

module.exports = db_connection;
