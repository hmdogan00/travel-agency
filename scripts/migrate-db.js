require("dotenv").config();
const mysql = require("mysql");

const sendQuery = (query) => {
  db.query(query, function (e, res, fields) {
    if (e) throw Error(e);
    console.log(res);
  });
};

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect();

sendQuery(`CREATE TABLE IF NOT EXISTS ActivityUser(
  person_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  role ENUM('Customer', 'Guide')
  )`);

sendQuery(`CREATE TABLE IF NOT EXISTS Customer(
  id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gender ENUM('Male','Female'),
    age INT NOT NULL,
    no_of_trips INT DEFAULT 0,
    identity_no INT NOT NULL,
    phone_no VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(100) NOT NULL
  )`);

sendQuery(`CREATE TABLE IF NOT EXISTS Guide(
  guide_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gender ENUM('Male','Female'),
    location VARCHAR(50) NOT NULL,
    rating FLOAT(10) DEFAULT 0,
    identity_no INT NOT NULL,
    phone_no VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(100) NOT NULL
  )`);

sendQuery(`
CREATE TABLE IF NOT EXISTS Employee(
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    identity_no INT NOT NULL,
    phone_no VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(100) NOT NULL
  )`);

sendQuery(`
CREATE TABLE IF NOT EXISTS Tour(
  tour_id INT PRIMARY KEY AUTO_INCREMENT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  name VARCHAR(50) NOT NULL,
  price FLOAT NOT NULL,
  capacity INT NOT NULL,
  company VARCHAR(50),
  type VARCHAR(10),
  rating FLOAT,
  location VARCHAR(50),
  person_id INT,
  is_accepted ENUM('accepted', 'waiting', 'rejected'),
  comment VARCHAR(500),
  rate FLOAT,
  FOREIGN KEY(person_id) REFERENCES Guide(guide_id)
  )`);

sendQuery(`
CREATE TABLE IF NOT EXISTS Reservation(
  reservation_id INT PRIMARY KEY AUTO_INCREMENT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reservation_person_count INT NOT NULL,
  is_canceled ENUM('approved', 'waiting', 'rejected'),
  tour_id INT, 
  FOREIGN KEY(tour_id) REFERENCES Tour(tour_id)
  )`);

sendQuery(`
CREATE TABLE IF NOT EXISTS Activity(
  activity_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(10),
  location VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price FLOAT NOT NULL,
  duration VARCHAR(50),
  age_restriction INT)`);

sendQuery(`
CREATE TABLE IF NOT EXISTS Hotel(
  hotel_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  location VARCHAR(50),
  rating FLOAT,
  phone_no VARCHAR(50) NOT NULL,
  occupancy_rate FLOAT,
  no_of_empty_room INT,
  no_of_total_room INT)`);

sendQuery(`
CREATE TABLE IF NOT EXISTS HotelRoom(
  hotel_room_no INT NOT NULL,
  room_size INT NOT NULL,
  room_floor VARCHAR(10) NOT NULL,
  room_price FLOAT NOT NULL,
  mini_bar_prices FLOAT,
  has_cleaned BIT,
  is_empty BIT,
  hotel_id INT NOT NULL,
  FOREIGN KEY(hotel_id) REFERENCES Hotel(hotel_id),
  PRIMARY KEY(hotel_room_no, hotel_id))`);

sendQuery(`
CREATE TABLE IF NOT EXISTS ActivityIdea(
  act_idea_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(10),
  location VARCHAR(50),
  description VARCHAR(300),
  is_accepted ENUM('accepted', 'waiting', 'rejected') DEFAULT 'waiting')`);

sendQuery(`
CREATE TABLE IF NOT EXISTS make(
  employee_id INT,
  reservation_id INT,
  person_id INT,
  FOREIGN KEY(employee_id) REFERENCES Employee(employee_id),
  FOREIGN KEY(reservation_id) REFERENCES Reservation(reservation_id),
  FOREIGN KEY(person_id) REFERENCES Customer(id),
  PRIMARY KEY(employee_id, reservation_id))`);

sendQuery(`
CREATE TABLE IF NOT EXISTS book(
  employee_id INT,
  hotel_room_no INT NOT NULL,
  hotel_id INT NOT NULL,
  person_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_accepted ENUM('accepted', 'waiting', 'rejected'),
  FOREIGN KEY(employee_id) REFERENCES Employee(employee_id),
  FOREIGN KEY(hotel_room_no) REFERENCES HotelRoom(hotel_room_no),
  FOREIGN KEY(hotel_id) REFERENCES HotelRoom(hotel_id),
  FOREIGN KEY(person_id) REFERENCES Customer(id),
  PRIMARY KEY(employee_id, hotel_room_no, hotel_id))`);

sendQuery(`
CREATE TABLE IF NOT EXISTS update_res(
  employee_id INT NOT NULL,
  reservation_id INT NOT NULL,
  FOREIGN KEY(employee_id) REFERENCES Employee(employee_id),
  FOREIGN KEY(reservation_id) REFERENCES Reservation(reservation_id),
  PRIMARY KEY(employee_id, reservation_id))`);

sendQuery(`
CREATE TABLE IF NOT EXISTS create_activity(
  act_idea_id INT NOT NULL,
  person_id INT NOT NULL,
  FOREIGN KEY(act_idea_id) REFERENCES ActivityIdea(act_idea_id),
  FOREIGN KEY(person_id) REFERENCES ActivityUser(person_id),
  PRIMARY KEY(act_idea_id))`);

sendQuery(`
  CREATE TABLE IF NOT EXISTS has(
    tour_id INT NOT NULL,
    activity_id INT NOT NULL,
    FOREIGN KEY(tour_id) REFERENCES Tour(tour_id),
    FOREIGN KEY(activity_id) REFERENCES Activity(activity_id),
    PRIMARY KEY(tour_id, activity_id))`);

sendQuery(`
  CREATE TABLE IF NOT EXISTS accepted(
    tour_id INT NOT NULL,
    FOREIGN KEY(tour_id) REFERENCES Tour(tour_id),
    employee_id INT NOT NULL, 
    FOREIGN KEY(employee_id) REFERENCES Employee(employee_id),
    act_idea_id INT NOT NULL, 
    FOREIGN KEY(act_idea_id) REFERENCES ActivityIdea(act_idea_id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price FLOAT NOT NULL,
    duration VARCHAR(50),
    age_restriction INT,
    PRIMARY KEY(tour_id, employee_id))`);

sendQuery(`
  CREATE TABLE IF NOT EXISTS review(
    tour_id INT NOT NULL, 
    FOREIGN KEY(tour_id) REFERENCES Tour(tour_id),
    G_person_id INT NOT NULL,
    FOREIGN KEY(G_person_id) REFERENCES Guide(guide_id),
    C_person_id INT NOT NULL,
    FOREIGN KEY(C_person_id) REFERENCES Customer(id),
    tour_comment VARCHAR(500),
    tour_rate FLOAT NOT NULL,
    guide_comment VARCHAR(500),
    guide_rate FLOAT NOT NULL,
    PRIMARY KEY(tour_id, G_person_id))`);

db.end();
