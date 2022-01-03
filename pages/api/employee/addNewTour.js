import db from "../../../lib/db";

export default async (req, res) => {
  if ( req.method !== 'POST' ) {
    res.status(400).json({message: 'Method Not Allowed'})
    return;
  }
  let {start_date,end_date,name,price,capacity,company,type,location} = req.body;
  if (!start_date,!end_date,!name,!price,!capacity,!company,!type,!location) {
    res.status(423).json({message: 'No id found!'})
    return;
  }
  try {
    db.query(` INSERT INTO Tour (start_date, end_date, name, price, capacity, company, type,rating,location, ratingCount) 
    VALUES ('${start_date}', '${end_date}', '${name}',${price},${capacity},'${company}','${type}',0,'${location}',0 );`, (err,result,fields) => {
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