import db from "../../lib/db";
const bcrypt = require("bcrypt");

const matchPasswords = async (err, results, password, email, res, role) => {
  if (err) return res.status(401).json({ message: err });
  else {
    if (results.length === 0) return res.status(201).json({ message: "No user with given credentials!", messageType: "ERROR" });
    const validPassword = await bcrypt.compare(password, results[0].password);
    if (validPassword) return res.status(200).json({ email: email, id: (role === "Customer" ? results[0].id : role === "Employee" ? results[0].employee_id : results[0].guide_id), messageType: "SUCCESS" });
    else return res.status(201).json({ message: "No user with given credentials!", messageType: "ERROR" });
  }
};

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const { email, password, role } = req.body;
    return db.query(
      `SELECT * FROM ${role} as C WHERE C.email = '${email}'`,
      (err, results) => matchPasswords(err, results, password, email, res, role)
    );
  } catch (err) {
    return res.status(402).json({ message: err });
  }
};
