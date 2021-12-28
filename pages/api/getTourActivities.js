import db from "../../lib/db";

export default (req, res) => {
  if ( req.method !== "GET" ) return Promise.reject("Invalid method");
  try {
    const {id} = req.query;
    return db.query(`SELECT * FROM Activity NATURAL JOIN has WHERE tour_id=${id}`, function (err, results, fields) {
      if (err) {
        res.status(401).json({ message: err }).res.end();
        return Promise.reject(err);
      }
      console.log(results)
      const originalActivities = []
      originalActivities.push(...results)
      return db.query(`SELECT * FROM ActivityIdea NATURAL JOIN accepted WHERE is_accepted='accepted' and tour_id=${id}`, function (err, results, fields) {
        if ( err ) return res.status(401).json({message:err}.res.end())
        const activities = [...originalActivities,...results];
        return res.status(200).json({ results: activities });
      })
    });
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
