import db from "../../../lib/db";

export default (req, res) => {
  if (req.method !== "POST") return Promise.reject("Invalid method");
  let { hotel_id } = req.body;
  try {
    db.query(`SELECT B.start_date, B.end_date, H.name, B.hotel_room_no, C.name as c_name, C.phone_no
    FROM Customer C, book B, Hotel H
    WHERE B.is_accepted = 'waiting' and B.start_date >= curdate() and B.hotel_id = ${hotel_id}
    and B.hotel_id = H.hotel_id and C.id = B.person_id`, function (err, results, fields) {
      if (err) {
        res.statusCode = 401;
        res.json({ message: err });
        res.end();
        return res;
      }
      res.status(200).json({ results: results });
      return Promise.resolve(res);
    });
  } catch (e) {
    console.log(e);
  }
};
