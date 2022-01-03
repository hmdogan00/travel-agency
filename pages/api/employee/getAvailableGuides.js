import db from "../../../lib/db";

export default (req, res) => {
  if ( req.method !== "GET" ) return Promise.reject("Invalid method");
  try {
    const { start, end } = req.query;
    db.query(`SELECT * FROM Guide WHERE guide_id NOT IN (
      SELECT G.guide_id FROM Tour T INNER JOIN Guide G ON T.person_id = G.guide_id AND T.start_date < '${end}'
      AND T.end_date > '${start}'
      )`, function (err, results, fields) {
      if (err) {
        res.statusCode = 401;
        res.json({ message: err });
        res.end();
        return Promise.reject(err);
      }
      res.status(200).json({ results: results, fields: fields });
      return Promise.resolve(res);
    });
  } catch (e) {
  }
};
