require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect()

export default db;