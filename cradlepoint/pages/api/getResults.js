const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested test plan from the database
  
  Will pull every test associated with a test

  Input: takes in a test ID
*/
export default async (req, res) => {
  const query = { 'testId': ObjectId(req.query.testId) };

  const client = await connectToDb();
  const cursor = client.collection("result").find(query);
  const results = await cursor.toArray();
  res.json(results);
};