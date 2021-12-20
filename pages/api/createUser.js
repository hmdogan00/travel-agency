import db from "../../lib/db";
const bcrypt = require("bcrypt");
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed'});
  try {
    const {user} = req.body;
    let result;
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(user.password, salt)
    if(user.role === "Customer"){
    db.query(`INSERT INTO tripFellas.Customer (name, gender, age, identity_no, phone_no, email, password) 
    VALUES ('${user.name}', '${user.gender}', ${user.age}, '${user.identity_no}', '${user.phone_no}', '${user.email}', '${pass}')
    `, (err, results, fields) => {
      if (err) result = res.status(401).json({ message: err})
      else result = res.status(200).json({res:results});
    })}
    else if(user.role === "Employee"){
      db.query(`INSERT INTO tripFellas.Employee (name, email, identity_no, phone_no, password) 
      VALUES ('${user.name}', '${user.email}', '${user.identity_no}', '${user.phone_no}', '${pass}')
      `, (err, results, fields) => {
        if (err) result = res.status(401).json({ message: err})
        else result = res.status(200).json({res:results});
      })}
      else if(user.role === "Guide"){
        db.query(`INSERT INTO tripFellas.Guide (name, location, email, identity_no, phone_no, gender, password) 
        VALUES ('${user.name}', '${user.location}', '${user.email}','${user.identity_no}', '${user.phone_no}','${user.gender}', '${pass}')
        `, (err, results, fields) => {
          if (err) result = res.status(401).json({ message: err})
          else result = res.status(200).json({res:results});
        })}
    return result;
  }
  catch ( err ){
    console.log(err)
    return res.status(402).json({ message: err})
  }
}
