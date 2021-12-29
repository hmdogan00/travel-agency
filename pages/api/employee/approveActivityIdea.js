import { result } from "lodash";
import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if ( req.method !== 'POST' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  const { actID, empID, activity } = req.body;
  if (!actID){
    res.status(423).json({message: 'No id found!'})
    return;
  }
  try {
      let answer;
    db.query(`UPDATE ActivityIdea
                    SET is_accepted ='accepted'
                    WHERE act_idea_id = ${actID}`, (err,result,fields) => {
      if (err) {  
        return res.status(400).json({message: err});
      }
    })
    db.query(`INSERT INTO accepted (tour_id, employee_id, act_idea_id, start_date, end_date, price, duration, age_restriction) 
    VALUES (${activity.tour}, ${empID}, ${actID}, '${activity.start}', '${activity.end}', ${activity.price}, '${activity.duration}', ${activity.age})
    ` , (err,result,fields) => {
        if (err) {  
          return res.status(400).json({message: err});
        }
        answer = res.status(200).json({message: "SUCCESS"})
      })
      return answer;
  }
  catch ( err ){
    res.status(200).json({ message: err, messageType: 'ERROR'})
    return;
  }
}