import db from "../../../lib/db";

export default async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    const { reservation, id } = req.body;
    db.query(
      `INSERT INTO Reservation ( start_date, end_date, reservation_person_count, is_canceled, tour_id)
      VALUES (STR_TO_DATE('${reservation.start}', '%Y-%m-%d'), STR_TO_DATE('${reservation.end}', '%Y-%m-%d'), ${reservation.resNumber}, 'approved', ${reservation.tourId})
    `,
      (err, results, fields) => {
        if (err) return res.status(401).json({ message: err });
        const resId = results.insertId;
        db.query(`SELECT C.id as cid FROM Customer C WHERE C.identity_no = ${reservation.identity}`, (err, results, fields) => {
          if (err) return res.status(401).json({message:err})
          const customerId = results[0].cid;
          db.query(
            `INSERT INTO make VALUES (${id}, ${resId}, ${customerId})`, (err, results, fields) => {
              if (err) return res.status(401).json({message:err})
              return res.status(200).json({message: 'Success', results})
            }
          )
        })
      }
    );
    return;
  } catch (err) {
    return res.status(402).json({ message: err });
  }
};
