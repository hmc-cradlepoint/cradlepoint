const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested result from the database
  
  Input: takes in a result ID
*/
export default async (req, res) => {
  const query = { '_id': ObjectId(req.query._id) };

  const client = await connectToDb();
  const cursor = client.collection("result").find(query);
  const results = await cursor.toArray();
  res.json(results);
};

export async function getResult(_id) {
  const query = { '_id': ObjectId(_id) };

  const client = await connectToDb();
  const cursor = client.collection("result").find(query);
  const results = await cursor.toArray();
  return JSON.parse(JSON.stringify(results));
};