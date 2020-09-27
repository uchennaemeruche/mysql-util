const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql");

module.exports = connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 25
});