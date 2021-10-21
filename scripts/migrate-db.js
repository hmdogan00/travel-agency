require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect();

db.query(
  `CREATE TABLE Customer(
  id INT PRIMARY KEY AUTO_INCREMENT,
    name linestring NOT NULL,
    gender ENUM('Male','Female'),
    age INT NOT NULL,
    no_of_trips INT DEFAULT 0,
    identity_no INT NOT NULL,
    phone_no linestring,
    email linestring
  )`, function (error, results, fields) {
    if (error) throw Error(error);
    console.log(results, fields);
  }
);

db.end();