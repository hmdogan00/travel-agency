import db from "../../../lib/db";

export default async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    const { reservation, id } = req.body;
    return db.query(
      `INSERT INTO Reservation ( start_date, end_date, reservation_person_count, is_canceled, tour_id)
      VALUES (STR_TO_DATE('${reservation.start}', '%Y-%m-%d'), STR_TO_DATE('${reservation.end}', '%Y-%m-%d'), ${reservation.resNumber}, 'waiting', ${reservation.tourId})
    `,
      (err, results, fields) => {
        if (err) return res.status(401).json({ message: err });
        const resId = results.insertId;
        return db.query(
          `INSERT INTO make VALUES ( 1, ${resId}, ${id})`, (err, results, fields) => {
            if (err) return res.status(401).json({message:err})
            return res.status(200).json({message: 'Success', results})
          }
        )
      }
    );
  } catch (err) {
    return res.status(402).json({ message: err });
  }
};
