const mysql2 = require("mysql2/promise");

const db_connection = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "movies",
  // port: "3306",
  // connectionLimit: 100,
});

module.exports = db_connection;
