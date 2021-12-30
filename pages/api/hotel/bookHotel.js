import db from "../../../lib/db";

export default (req, res) => {
  if (req.method !== "POST") return Promise.reject("Invalid method");
  let{hotel_room_no} = req.body;
  let{hotel_id} = req.body;
  let{person_id} = req.body;
  let{start_date} = req.body;
  let{end_date} = req.body;
  try {
    db.query(`INSERT INTO book VALUES(1,${hotel_room_no},${hotel_id},${person_id},'${start_date}','${end_date}', 'waiting','')`, function (err, results, fields) {
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
