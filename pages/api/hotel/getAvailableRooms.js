import db from "../../../lib/db";

export default (req, res) => {
  if ( req.method !== "GET" ) return Promise.reject("Invalid method");
  try {
    const {hotel_id, size, st, en} = req.query
    db.query(`SELECT *
    FROM HotelRoom
    WHERE hotel_id=${hotel_id} and room_size=${size} and hotel_room_no NOT IN(
    SELECT h.hotel_room_no
    FROM HotelRoom h NATURAL JOIN book b
    WHERE end_date >= ${st} and start_date <= ${en} and
          (${st} between start_date and end_date) and (${en} between start_date and end_date) and
          b.hotel_id = ${hotel_id}
        )`, function (err, results, fields) {
      if (err) return res.status(401).json({ message: err });
      res.status(200).json({ results: results});
      return Promise.resolve(res);
    });
  } catch (e) {
    console.log(e);
  }
};
