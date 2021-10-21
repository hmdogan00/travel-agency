// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from "../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed'});
  try {
    const {user} = req.body;
    let result;
    db.query(`INSERT INTO travelagency.Customer (name, gender, age, identity_no, phone_no, email) 
    VALUES ('${user.name}', '${user.gender}', ${user.age}, '${user.identity_no}', '${user.phone_no}', '${user.email}')
    `, (err, results, fields) => {
      if (err) result = res.status(400).json({ message: err})
      else result = res.status(200).json({res:results});
    })
    return result;
  }
  catch ( err ){
    return res.status(400).json({ message: err})
  }
}
