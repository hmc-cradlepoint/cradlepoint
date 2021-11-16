const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {testSchema} from "../../schemas/testSchema";
/*
  Edits the requested test from the database
*/
const query = { '_id': ObjectId("6192e77bb769d28dff5942c9") };
// const data = {
//   "_id": "6192e77bb769d28dff5942c9", 
//   "details": "test post details",
//   "name": "test name",
//   "results": [""],
//   "testCaseId": "618ff52599912cea5510f06b",
// }; 

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
  }
  try{
    const data = req.body;
    const valid = await testSchema.isValid(data);
    if (valid && ObjectId.isValid(data.testCaseId)){
      const result = testSchema.cast(data);
      // Set ID strings to Mongo ObjectId's
      const newId = ObjectId(result._id);
      const newTestCaseId = ObjectId(result.testCaseId);
      const query = {_id: newId};
      delete result._id;
      delete result.testCaseId;
      const newTest = {_id: newId, testCaseId:newTestCaseId, ...result };
      // Update the Database w/ new test
      const db = await connectToDb();
      await db.collection("tests").replaceOne(query, newTest);
      //res.json(newTest);
      res.status(200).send({message: "Success!"});
    } else {
      res.status(422).send({message: 'Input not in right format'})
    }

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};