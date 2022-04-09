const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets archived test plans associated with an engagement
*/
export default async (req, res) => {

  const query = { 'engagementId': ObjectId(req.query.engagementId),
                  'isActive': false };

  const client = await connectToDb();
  const cursor = client.collection("testPlan").find(query);
  const results = await cursor.toArray();
  res.json(results);
};

export async function getTestPlansByEngagementId(engagementId) {

  const query = { 'engagementId': ObjectId(engagementId),
                  'isActive': false };

  const client = await connectToDb();
  const cursor = client.collection("testPlan").find(query);
  const results = await cursor.toArray();
  return JSON.parse(JSON.stringify(results));
};