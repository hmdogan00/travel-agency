import db from "../../../lib/db";
export default async (req, res) => {
    if ( req.method !== 'GET' ) {
      res.status(400).json({message: 'Method Not Allowed'})
      return;
    }
    let answer;
    try {
      await db.query(`SELECT C.name, B.start_date, HR.hotel_room_no, H.name
                    FROM Customer C NATURAL JOIN book B, Hotel H NATURAL JOIN HotelRoom HR
                    WHERE B.hotel_room_no = HR.hotel_room_no and B.hotel_id = HR.hotel_id`, (err,result,fields) => {
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