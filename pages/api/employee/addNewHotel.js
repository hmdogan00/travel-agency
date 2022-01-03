import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if ( req.method !== 'POST' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  let {name,location,phone_no,no_of_empty_room,no_of_total_room} = req.body;
  if (!name,!location,!phone_no,!no_of_empty_room,!no_of_total_room) {
    res.status(423).json({message: 'No id found!'})
    return;
  }
  let answer;
  let occupied_room = no_of_total_room - no_of_empty_room;
  let occupancy_rate = occupied_room/no_of_total_room;
  try {
    await db.query(`
    INSERT INTO Hotel (name, location, rating, phone_no, occupancy_rate, no_of_empty_room, no_of_total_room) VALUES ('${name}', '${location}', 0,${phone_no},'${occupancy_rate}','${no_of_empty_room}','${no_of_total_room}');`, (err,result,fields) => {
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