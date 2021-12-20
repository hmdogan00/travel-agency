import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if ( req.method !== 'POST' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  let {name} = req.body;
  if (!name){
    res.status(423).json({message: 'No id found!'})
    return;
  }
  let answer;
  try {
    await db.query(`SELECT C.name, B.start_date, HR.hotel_room_no, H.name
    FROM Customer C NATURAL JOIN book B, Hotel H NATURAL JOIN HotelRoom HR
    WHERE B.hotel_room_no = HR.hotel_room_no and B.hotel_id = HR.hotel_id and C.name = '%${name}%'`, (err,result,fields) => {
      if (err) {  
        res.status(400).json({message: err})
        return;
      }
      answer = result
      res.status(200).json({result})
    })
  }
  catch ( err ){
    res.status(200).json({ message: err, messageType: 'ERROR'})
    return;
  }
}