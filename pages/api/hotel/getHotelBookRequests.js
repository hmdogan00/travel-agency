import db from "../../../lib/db";

export default (req, res) => {
  if ( req.method !== "POST" ) return Promise.reject("Invalid method");
  let{hotel_id} = req.body;
  try {
    db.query(`SELECT * FROM book WHERE is_accepted = 'waiting' and start_date >= curdate() and hotel_id = ${hotel_id} `, function (err, results, fields) {
      if (err) {
        res.statusCode = 401;
        res.json({ message: err });
        res.end();
        return res;
      }
      res.status(200).json({ results: results});
      return Promise.resolve(res);
    });
  } catch (e) {
    console.log(e);
  }
};
