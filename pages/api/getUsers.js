import db from "../../lib/db";

// eslint-disable-next-line import/no-anonymous-default-export
export default (req, res) => {
  try {
      db.query("SELECT * FROM Customer", function (err, results, fields) {
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
    console.log(e);
  }
};
