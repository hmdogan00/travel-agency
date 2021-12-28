import db from "../../lib/db.js";

export default async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });
  try {
    const {
      tourId,
      guideId,
      customerId,
      tourComment,
      tourRate,
      guideComment,
      guideRate,
      tourRateCnt,
      guideRateCnt,
      guideOldRate,
      tourOldRate,
    } = req.body;
    return db.query(
      `INSERT INTO review
      VALUES (${tourId}, ${guideId}, ${customerId}, '${tourComment}', ${tourRate}, '${guideComment}', ${guideRate})
    `,
      (err, results, fields) => {
        if (err) return res.status(401).json({ message: err });
        const newTourRating =
          (tourOldRate * tourRateCnt + tourRate) / (tourRateCnt + 1);
        const newGuideRating =
          (guideOldRate * guideRateCnt + guideRate) / (guideRateCnt + 1);
        return db.query(
          `
          UPDATE Tour
          SET rating = ${newTourRating}, ratingCount = ${tourRateCnt + 1}
          WHERE tour_id=${tourId}
          `,
          (err, results, fields) => {
            if (err) return res.status(401).json({ message: err });
            return db.query(
              `
              UPDATE Guide
              SET rating = ${newGuideRating}, ratingCount = ${guideRateCnt + 1}
              WHERE guide_id=${guideId}
              `,
              (err, results, fields) => {
                if (err) return res.status(401).json({ message: err });
                return res.status(200).json({message:"Success"})
              }
            );
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(402).json({ message: err });
  }
};
