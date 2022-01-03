import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if ( req.method !== 'POST' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  let {guideId, tourId, tourOldRate, tourRateCnt, tourComment, tourRate} = req.body;
  if (!guide_id){
    res.status(423).json({message: 'No id found!'})
    return;
  }
  let answer;
  try {
    let count = tourRateCnt + 1;
    let rate = (tourOldRate * tourRateCnt + tourRate) / count;
    await db.query(`UPDATE Tour
                    SET comment = ${tourComment}, rating = ${rate}, ratingCount = ${count} 
                    WHERE tour_id = ${tourId} and person_id = ${guideId} and is_accepted = 'accepted'`, (err,result,fields) => {
      if (err) {  
        res.status(400).json({message: err})
        return;
      }
      answer = result
      res.status(200).json({result})
    })
  }
  catch ( err ){
    res.status(200).json({ message: err, messageType: 'ERROR'})
    return;
  }
}