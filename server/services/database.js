const db_connection = require("../db/movies_database");

const executeDBQuery = async (sql, values) => {
  const value = await db_connection.execute(sql, values);
  return value;
};

module.exports = executeDBQuery;
