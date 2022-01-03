import db from "../../../lib/db";

export default (req, res) => {
  if (req.method !== "POST") return Promise.reject("Invalid method");
  let { hotel_id, res_status } = req.body;
  try {
    db.query(`SELECT B.start_date, B.end_date, H.name, 
    B.hotel_room_no, C.name AS c_name, C.phone_no,
    B.employee_id, B.hotel_id, B.person_id, COUNT(*) AS no_of_persons
    FROM Customer C, book B, Hotel H
    WHERE B.is_accepted = '${res_status}' and B.hotel_id = ${hotel_id}
    and B.hotel_id = H.hotel_id and C.id = B.person_id
    GROUP BY C.name, B.hotel_room_no, B.start_date, B.end_date`, function (err, results, fields) {
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
  }
};
