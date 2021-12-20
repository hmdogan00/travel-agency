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
    name VARCHAR(50) NOT NULL,
    gender ENUM('Male','Female'),
    age INT NOT NULL,
    no_of_trips INT DEFAULT 0,
    identity_no INT NOT NULL,
    phone_no VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(50) NOT NULL
  )`);
  sendQuery(`CREATE TABLE IF NOT EXISTS Guide(
  guide_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    gender ENUM('Male','Female'),
    location VARCHAR(50) NOT NULL,
    rating FLOAT(10) DEFAULT 0,
    identity_no INT NOT NULL,
    phone_no VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(50) NOT NULL
  )`)
  sendQuery(`
CREATE TABLE IF NOT EXISTS Employee(
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    role ENUM('MANAGER','STAFF'),
    identity_no INT NOT NULL,
    phone_no VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(50) NOT NULL
  )`)

db.end();