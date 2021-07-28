const mysql = require("mysql");
const mysqlUtil = require("./index");
const dotenv = require("dotenv");

dotenv.config();

const createDB = (host, user, password, dbName) => {
  const sql = `CREATE DATABASE IF NOT EXISTS ${dbName} SET UTF8 COLLATE utf8_general_ci`;
  const dbConnection = mysql.createConnection({
    host,
    user,
    password,
  });
  dbConnection.connect((err) => {
    if (err) throw err;
    dbConnection.query(sql, (err, result) => {
      if (err) throw err;
      return result;
    });
  });
};

/*

queryUtil.schema.createTable('tableName', {increments(true), timestamps(true) name(string), })
*/

const initDB = () => {
  mysqlUtil.setConnectionPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
  });
  mysqlUtil
    .rawQuery("CREATE DATABASE IF NOT EXISTS mekiotechdi")
    .then((res) => {
      console.log(res);
    });
};
initDB();
