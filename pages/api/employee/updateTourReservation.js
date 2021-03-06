import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Method Not Allowed' })
    return;
  }
  let { start, end, person_count, tour_id, res_id } = req.body;
  let answer;
  try {
    await db.query(`UPDATE Reservation
                    SET start_date = '${start}', end_date = '${end}', reservation_person_count = ${person_count}, tour_id = ${tour_id}
                    WHERE reservation_id = ${res_id}`, (err, result, fields) => {
      if (err) {
        res.status(400).json({ message: err })
        return;
      }
      answer = result
      res.status(200).json({ result })
    })
  }
  catch (err) {
    res.status(200).json({ message: err, messageType: 'ERROR' })
    return;
  }
}