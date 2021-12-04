const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested test case from the database
*/
export default async (req, res) => {

  const query = { '_id': ObjectId(req.query.testCaseId) };

  const client = await connectToDb();
  const cursor = client.collection("testCases").find(query);
  const results = await cursor.toArray();
  res.json(results);
};