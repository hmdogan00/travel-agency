import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if ( req.method !== 'POST' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  let {name} = req.body;
  if (!name){
    res.status(423).json({message: 'No id found!'})
    return;
  }
  let answer;
  try {
    await db.query(`USELECT T.name, start_date, T.location
    FROM Tour T
    WHERE T.person_id != null and is_accepted='waiting' and WHERE T.name = '%${name}%'`, (err,result,fields) => {
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