require("dotenv").config();
const mysql = require("mysql");
const url = process.env.MYSQL_URL;
const arr = url.split('@')
const [uname, pw] = arr[0].split('//')[1].split(':')
const [host, portAndDb] = arr[1].split(':')
const [port, database] = portAndDb.split('/')
const db = mysql.createConnection({
  host:host,
  user:uname,
  password:pw,
  port:port,
  database: database,
  timezone: '+00:00',
});

db.connect()

export const sendQuery = (query) => {
  db.query(query, function (e, res, fields){
    if (e) throw Error(e);
    console.log(res)
  })
}

export default db;