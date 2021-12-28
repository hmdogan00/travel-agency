import db from "../../lib/db";

export default (req, res) => {
  if ( req.method !== "GET" ) return Promise.reject("Invalid method");
  try {
    return db.query(`SELECT * FROM Tour WHERE tour_id=${req.query.id}`, function (err, results, fields) {
      if (err) {
        res.statusCode = 401;
        res.json({ message: err });
        res.end();
        return Promise.reject(err);
      }
      const tour = results[0]
      return db.query(`SELECT * FROM Guide WHERE guide_id=${tour.person_id}`, (err, results, fields) => {
        if (err) return res.status(401).json({message:err}).res.end()
        res.status(200).json({ results: {guide:results[0], tour:tour}, fields: fields });
        return Promise.resolve(res);
      })
    });
  } catch (e) {
    console.log(e);
  }
};
