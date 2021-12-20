import db from "../../../lib/db";
export default async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).json({ message: "Method Not Allowed" });
    return;
  }
  let answer;
  try {
    await db.query(
      `SELECT C.name as c_name, B.start_date, HR.hotel_room_no, H.name as h_name
                    FROM Customer C NATURAL JOIN book B, Hotel H NATURAL JOIN HotelRoom HR
                    WHERE B.hotel_room_no = HR.hotel_room_no and B.hotel_id = HR.hotel_id and C.id = B.person_id
                    ORDER BY start_date DESC`,
      (err, result, fields) => {
        if (err) {
          res.statusCode = 401;
          res.json({ message: err });
          res.end();
          return Promise.reject(err);
        }
        console.log(result)
        res.status(200).json({ result });
        return Promise.resolve(res);
      }
    );
  } catch (err) {
    res.status(200).json({ message: err, messageType: "ERROR" });
    return;
  }
};
