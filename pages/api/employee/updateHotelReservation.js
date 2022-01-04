import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Method Not Allowed' })
    return;
  }
  let { oldbook, newbook, id } = req.body;
  id = parseInt(id);
  if (!id) {
    res.status(423).json({ message: 'No id found!' })
    return;
  }
  let answer;
  try {
    await db.query(`UPDATE book
                    SET start_date = '${newbook.start}', end_date = '${newbook.end}', hotel_room_no = ${newbook.room}, employee_id = ${id} 
                    WHERE employee_id = ${oldbook.id} and hotel_room_no = ${oldbook.room} and hotel_id = ${oldbook.hotel} and
                    start_date = '${oldbook.start}' and end_date = '${oldbook.end}'`, (err, result, fields) => {
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