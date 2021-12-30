import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    let { activity, id } = req.body;
    let result;
    let answer;
    db.query(
      `INSERT INTO ActivityIdea (name, type, location, description) 
    VALUES ('${activity.name}', '${activity.type}', '${activity.location}', '${activity.description}')
    `,
      (err, results, fields) => {
        if (err) result = res.status(401).json({ message: err });
      }
    );
    db.query(`SELECT LAST_INSERT_ID() as act_id`, (err, results) => { 
      if (err) return res.status(401).json({message:err})
      console.log(results);
      const actId = results[0].act_id;
      db.query(`INSERT INTO create_activity (act_idea_id, person_id) 
      VALUES ('${actId}', '${id}')`, (err, results, fields) => {
        if (err) answer = res.status(401).json({ message: err });
        else answer = res.status(200).json({ res: results });
      })
    })
    return result;
  } catch (err) {
    console.log(err);
    return res.status(402).json({ message: err });
  }
};