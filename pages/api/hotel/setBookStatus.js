import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Method Not Allowed' })
    return;
  }
  let { employee_id, hotel_room_no, hotel_id, person_id, start_date, end_date, is_accepted } = req.body;
  if (!employee_id || !hotel_room_no || !hotel_id || !person_id || !start_date || !end_date) {
    res.status(423).json({ message: 'No id found!' })
    return;
  }
  try {
    if (is_accepted === 'accepted') {
      return db.query(`UPDATE book
        SET is_accepted = '${is_accepted}'
        WHERE employee_id = ${employee_id} and hotel_room_no = ${hotel_room_no} and hotel_id = ${hotel_id} 
        and person_id = ${person_id} and start_date = '${start_date}' and end_date = '${end_date}'`, (err, results, fields) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
        console.log(results, fields)
        return res.status(200).json({ results })
      })
    }
    else {
      let { reject_reason } = req.body;
      return db.query(`UPDATE book
        SET is_accepted = '${is_accepted}',reject_reason = '${reject_reason}'
        WHERE employee_id = ${employee_id} and hotel_room_no = ${hotel_room_no} and hotel_id = ${hotel_id} 
        and person_id = ${person_id} and start_date = '${start_date}' and end_date = '${end_date}'`, (err, result, fields) => {
        if (err) {
          res.status(400).json({ message: err })
          return;
        }
        return res.status(200).json({ result })
      })
    }
  }
  catch (err) {
    return res.status(401).json({ message: err, messageType: 'ERROR' })
  }
}