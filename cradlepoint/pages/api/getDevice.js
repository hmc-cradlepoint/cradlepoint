const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested device from the database
*/
export default async (req, res) => {

  const query = { '_id': ObjectId(req.query.deviceId) };

  const client = await connectToDb();
  const cursor = client.collection("device").find(query);
  const results = await cursor.toArray();
  res.json(results);
};