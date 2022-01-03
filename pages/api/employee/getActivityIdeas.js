import db from "../../../lib/db";
export default async (req, res) => {
    if (req.method !== 'POST')
        return res.status(400).json({ message: "Method not allowed" });

    let { res_type } = req.body;

    try {
        await db.query(`SELECT AU.name, AU.role, AI.act_idea_id, AI.type, AI.name, AI.location, AI.description 
        FROM ActivityIdea AI, create_activity CA, ActivityUser AU
        WHERE AI.is_accepted = '${res_type}' and AI.act_idea_id = CA.act_idea_id and AU.person_id = CA.person_id`, (err, result, fields) => {
            if (err) {
                res.statusCode = 401;
                res.json({ message: err });
                res.end();
                return Promise.reject(err);
            }
            res.status(200).json({ result });
            return Promise.resolve(res);
        });
    } catch (error) {
        res.status(200).json({ message: err, messageType: "ERROR" });
        return;
    }
}