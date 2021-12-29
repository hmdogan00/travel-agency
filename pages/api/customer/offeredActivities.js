import db from "../../../lib/db";
export default async (req, res) => {
    if(req.method !== 'GET')
        return res.status(400).json({ message: "Method not allowed" });
    try {
        let { id } = req.query;
        id = parseInt(id);
        await db.query(`SELECT AI.type, AI.name, AI.location, AI.description, AI.is_accepted FROM ActivityIdea AI, create_activity CA
        WHERE AI.act_idea_id = CA.act_idea_id and CA.person_id = ${id}`, (err, result, fields) =>{
            if (err) {  
                res.statusCode = 401;
                res.json({ message: err });
                res.end();
                return Promise.reject(err);
            }
            console.log(result)
            res.status(200).json({ result });
            return Promise.resolve(res);
        });
    } catch (error) {
        res.status(200).json({ message: err, messageType: "ERROR" });
        return;
    }
}