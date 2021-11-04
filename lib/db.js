require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect()

export const sendQuery = (query) => {
  db.query(query, function (e, res, fields){
    if (e) throw Error(e);
    console.log(res)
  })
}

export default db;