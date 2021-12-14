const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {testSchema} from "../../schemas/testSchema";
/*
  Edits the requested test from the database
*/

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).send({ message: 'Only PUT requests allowed' })
  }
  try{
    const data = req.body;
    const valid = await testSchema.isValid(data);
    const validResults = !data.results.map((str) =>ObjectId.isValid(str)).includes(false);
    const validObjectIds = validResults && ObjectId.isValid(data.testCaseId) && ObjectId.isValid(data._id);
    if (valid && validObjectIds){
      const validData = testSchema.cast(data);
      // Set ID strings to Mongo ObjectId's
      const id = ObjectId(validData._id);
      const testCaseId = ObjectId(validData.testCaseId);
      const results = validData.results.map(resultId => ObjectId(resultId));
      // Create the database query and replacement object
      const query = {_id: id};
      const newTest = {...validData, _id: id, testCaseId:testCaseId, results:results };
      // Update the Database w/ new test
      const db = await connectToDb();
      await db.collection("tests").replaceOne(query, newTest);
      res.status(200).send({message: "Success!"});
    } else {
      res.status(422).send({message: 'Input not in right format'})
    }
  } catch (err) {
    res.status(500).send(err);
  }
};