require("dotenv").config();
const mysql = require("mysql");

const sendQuery = (query) => {
  db.query(query, function (e, res, fields){
    if (e) throw Error(e);
    console.log(res)
  })
}

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect();

sendQuery(`CREATE TABLE IF NOT EXISTS Customer(
  id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    gender ENUM('Male','Female'),
    age INT NOT NULL,
    no_of_trips INT DEFAULT 0,
    identity_no INT NOT NULL,
    phone_no TEXT,
    email TEXT UNIQUE,
    password TEXT NOT NULL
  )`);
  sendQuery(`CREATE TABLE IF NOT EXISTS Guide(
  guide_id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    gender ENUM('Male','Female'),
    location TEXT NOT NULL,
    rating FLOAT(10) DEFAULT 0,
    identity_no INT NOT NULL,
    phone_no TEXT,
    email TEXT UNIQUE,
    password TEXT NOT NULL
  )`)
  sendQuery(`
CREATE TABLE IF NOT EXISTS Employee(
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    role ENUM('MANAGER','STAFF'),
    identity_no INT NOT NULL,
    phone_no TEXT,
    email TEXT UNIQUE,
    password TEXT NOT NULL
  )`)

db.end();