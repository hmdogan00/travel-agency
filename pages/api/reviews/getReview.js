import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if ( req.method !== 'POST' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  let {tour_id} = req.body;
  tour_id = parseInt(tour_id);
  let {G_person_id} = req.body;
  G_person_id = parseInt(G_person_id);
  let {C_person_id} = req.body;
  C_person_id = parseInt(C_person_id);
  if (!tour_id || !G_person_id || !C_person_id) {
    res.status(423).json({message: 'No id found!'})
    return;
  }
  let answer;
  try {
    await db.query(`SELECT tour_comment, tour_rate, guide_comment, guide_rate
                    FROM review
                    WHERE tour_id = ${tour_id} AND G_person_id = ${G_person_id} AND C_person_id = ${C_person_id}`, (err,result,fields) => {
      if (err) {  
        res.status(400).json({message: err})
        return;
      }
      if ( result.length === 0 ) {
        res.status(200).json({isReviewed: false})
        return;
      }
      else{
          const answer = {
              isReviewed: true,
              review: result
          }
          res.status(200).json(answer)
          return;
      }
    })
  }
  catch ( err ){
    res.status(200).json({ message: err, messageType: 'ERROR'})
    return;
  }
}