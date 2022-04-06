const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested test plan from the database
  
  Will pull every test associated with a test case

  Input: takes in a test case ID
*/
export default async (req, res) => {
  const query = { 'testCaseId': ObjectId(req.query.testCaseId) };

  const client = await connectToDb();
  const cursor = client.collection("tests").find(query);
  const results = await cursor.toArray();
  res.json(results);
};

export async function getTests(testCaseId) {
  const query = { 'testCaseId': ObjectId(testCaseId) };

  const client = await connectToDb();
  const cursor = client.collection("tests").find(query);
  const results = await cursor.toArray();
  return JSON.parse(JSON.stringify(results));
};