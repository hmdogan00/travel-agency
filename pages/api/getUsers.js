import db from "../../lib/db";

// eslint-disable-next-line import/no-anonymous-default-export
export default (req, res) => {
  try {
    db.query("SELECT * FROM Customer", function (err, results, fields) {
      if ( err ) return res.status(500).json({ message: err})
      res.status(200).json({ results: results, fields: fields });
    });
    return res;
  } catch (e) {
    return res.status(401).json({ message: e });
  }
};