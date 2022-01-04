import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if ( req.method !== 'POST' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  let {tour_id, G_person_id, C_person_id} = req.body;
  if (!tour_id || !G_person_id || !C_person_id) {
    res.status(423).json({message: 'No id found!'})
    return;
  }
  try {
    if ( G_person_id === C_person_id ){
      return db.query(`SELECT *
      FROM Tour 
      WHERE tour_id = ${tour_id} and person_id = ${G_person_id} and is_accepted = 'accepted' and comment IS NOT NULL`, (err, results, fields) => {
        if (err) return res.status(400).json({message:err});
        if (results.length === 0) return res.status(200).json({isReviewed:false});
        else {
          console.log(results)
          const answer = {
            isReviewed: true,
            review: results
          }
          return res.status(200).json(answer)
        }
      })
    }
    else {
      return db.query(`SELECT tour_comment, tour_rate, guide_comment, guide_rate
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
  }
  catch ( err ){
    res.status(200).json({ message: err, messageType: 'ERROR'})
    return;
  }
}