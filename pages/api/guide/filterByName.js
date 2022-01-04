import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if ( req.method !== 'GET' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  let {name} = req.query;
  if (!name){
    res.status(423).json({message: 'No id found!'})
    return;
  }
  try {
    return db.query(`SELECT *
    FROM Tour T
    WHERE T.name LIKE '%${name}%'`, (err,result,fields) => {
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