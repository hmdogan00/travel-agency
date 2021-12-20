import db from "../../../lib/db";

export default async (req, res) => {
  if (req.method !== "GET") {
    res.status(400).json({ message: "Method Not Allowed" });
    return;
  }
  let { id } = req.query;
  id = parseInt(id);
  if (!id) {
    res.status(423).json({ message: "No id found!" });
    return;
  }
  let answer;
  try {
    await db.query(
      `SELECT tour_id, name, start_date,end_date,location
                    FROM Tour NATURAL JOIN (SELECT tour_id
                              FROM make NATURAL JOIN Reservation
                              WHERE make.person_id =${id}) as mRti
                              ORDER BY start_date DESC`,
      (err, result, fields) => {
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
