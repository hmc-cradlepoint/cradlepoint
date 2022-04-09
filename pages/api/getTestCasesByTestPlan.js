const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested test cases associated with the given test plan from the database
*/
export default async (req, res) => {

  const query = { 'testPlanId': ObjectId(req.query.testPlanId) };

  const client = await connectToDb();
  const cursor = client.collection("testCases").find(query);
  const results = await cursor.toArray();
  res.json(results);
};

export async function getTestCasesByTestPlan(testPlanId) {

  const query = { 'testPlanId': ObjectId(testPlanId) };

  const client = await connectToDb();
  const cursor = client.collection("testCases").find(query);
  const results = await cursor.toArray();
  return JSON.parse(JSON.stringify(results));
};