const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested test plan from the database
*/
export default async (req, res) => {
  const query = { '_id': ObjectId(req.query.testPlanId) };

  const client = await connectToDb();
  const cursor = client.collection("testPlan").find(query);
  const results = await cursor.toArray();
  res.json(results);
};