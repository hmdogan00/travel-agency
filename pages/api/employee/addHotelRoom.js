import db from "../../../lib/db";
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Method Not Allowed' })
    return;
  }
  let { hotel_id, room_count, price, room_size, floor, minibar_price } = req.body;
  if (!hotel_id, !room_count, !room_size, !floor, !minibar_price) {
    res.status(423).json({ message: 'No id found!' })
    return;
  }
  let answer;

  try {
    for (let i = 0; i < room_count; i++) {
      let hotelRoomNo = floor * 100 + i;
      await db.query(
        `INSERT INTO HotelRoom (hotel_room_no, room_size, room_floor, room_price, mini_bar_prices, has_cleaned, hotel_id) 
    VALUES (${hotelRoomNo}, ${room_size},${floor}, ${price} ,${minibar_price},1,${hotel_id});`, (err, result, fields) => {
        if (err) {
          res.status(400).json({ message: err })
          return;
        }
        answer = result
        res.status(200).json({ result })
      })
    }
  }
  catch (err) {
    res.status(200).json({ message: err, messageType: 'ERROR' })
    return;
  }
}
