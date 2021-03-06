import db from "../../../lib/db";

export default (req, res) => {
  if ( req.method !== "GET" ) return Promise.reject("Invalid method");
  try {
    db.query("CALL GetAllHotels()", function (err, results, fields) {
      if (err) {
        res.statusCode = 401;
        res.json({ message: err });
        res.end();
        return res;
      }
      res.status(200).json({ results: results[0]});
      return Promise.resolve(res);
    });
  } catch (e) {
  }
};
