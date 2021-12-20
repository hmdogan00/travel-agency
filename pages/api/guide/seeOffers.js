import db from "../../../lib/db";
export default async (req, res) => {
    if ( req.method !== 'GET' ) {
      res.status(400).json({message: 'Method Not Allowed'})
      return;
    }
    let answer;
    try {
      await db.query(`SELECT T.name, start_date, T.location
                    FROM Tour T
                    WHERE T.person_id != null and is_accepted='waiting'
                    ORDER BY start_date DESC`, (err,result,fields) => {
        if (err) {  
            res.statusCode = 401;
            res.json({ message: err });
            res.end();
            return Promise.reject(err);
        }
        res.status(200).json({result})
        return Promise.resolve(res);
      })
    }
    catch ( err ){
      res.status(200).json({ message: err, messageType: 'ERROR'})
      return;
    }
  }