import db from "../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    const { activity } = req.body;
    let result;
      db.query(
        `INSERT INTO tripFellas.ActivtyIdea (name, type, location, description) 
    VALUES ('${activity.name}', '${activity.type}', ${activity.location}, '${activity.description}')
    `,
        (err, results, fields) => {
          if (err) result = res.status(401).json({ message: err });
          else result = res.status(200).json({ res: results });
        }
      );
    return result;
  } catch (err) {
    console.log(err);
    return res.status(402).json({ message: err });
  }
};