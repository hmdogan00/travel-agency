import db from "../../../lib/db";
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Method Not Allowed' })
    return;
  }
  let { res_type } = req.body;

  try {
    await db.query(`SELECT T.name as t_name, T.location, C.name as c_name, R1.end_date, R1.start_date, R1.reservation_id, R2.tour_id, R2.reservation_person_count as personNo
      FROM ((Customer C INNER JOIN make M ON C.id = M.person_id) NATURAL JOIN Reservation R1), (Reservation R2 INNER JOIN Tour T ON R2.tour_id = T.tour_id)
      WHERE R1.reservation_id = R2.reservation_id and R1.is_canceled = '${res_type}'
      ORDER BY start_date DESC`, (err, result, fields) => {
      if (err) {
        res.statusCode = 401;
        res.json({ message: err });
        res.end();
        return Promise.reject(err);
      }
      res.status(200).json({ result });
      return Promise.resolve(res);
    }
    );
  } catch (err) {
    res.status(200).json({ message: err, messageType: "ERROR" });
    return;
  }
};
