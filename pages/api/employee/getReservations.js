import db from "../../../lib/db";
export default async (req, res) => {
    if ( req.method !== 'GET' ) {
      res.status(400).json({message: 'Method Not Allowed'})
      return;
    }
    let answer;
    try {
      await db.query(`SELECT T.name as t_name, T.location, C.name as c_name, R1.end_date, R1.start_date, R1.reservation_id
      FROM ((Customer C INNER JOIN make M ON C.id = M.person_id) NATURAL JOIN Reservation R1), (Reservation R2 INNER JOIN Tour T ON R2.tour_id = T.tour_id)
      WHERE R1.reservation_id = R2.reservation_id 
                    ORDER BY start_date DESC`, (err,result,fields) => {
        if (err) {  
            res.statusCode = 401;
            res.json({ message: err });
            res.end();
            return Promise.reject(err);
        }
        console.log(result)
        res.status(200).json({ result });
        return Promise.resolve(res);
      }
    );
  } catch (err) {
    res.status(200).json({ message: err, messageType: "ERROR" });
    return;
  }
};
