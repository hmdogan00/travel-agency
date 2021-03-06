import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if ( req.method !== 'POST' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  let {id} = req.body;
  if (!id){
    res.status(423).json({message: 'No id found!'})
    return;
  }
  try {
    await db.query(`UPDATE ActivityIdea
                    SET is_accepted = 'rejected'
                    WHERE act_idea_id = ${id}`, (err,result,fields) => {
      if (err) {  
        res.status(400).json({message: err})
        return;
      }
      res.status(200).json({result})
    })
  }
  catch ( err ){
    res.status(200).json({ message: err, messageType: 'ERROR'})
    return;
  }
}