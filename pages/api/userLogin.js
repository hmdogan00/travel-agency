import db from "../../lib/db";
const bcrypt = require("bcrypt");
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    const { email, password, role } = req.body;
    if (role === "CUSTOMER") {
      db.query(
        `SELECT * FROM Customer as C WHERE C.email = '${email}'
    `,
        async (err, results, fields) => {
          if (err) return res.status(401).json({ message: err });
          else {
            const validPassword = await bcrypt.compare(password, results[0].password);
            if ( validPassword ){
              return res.status(200).json({ email: email, messageType:"SUCCESS" });
            }
            else{
              return res.status(201).json({ message: "Wrong password!", messageType:"ERROR"});
            }
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(402).json({ message: err });
  }
};
