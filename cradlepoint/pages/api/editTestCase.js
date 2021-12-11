const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {testCaseSchema} from "../../schemas/testCaseSchema";
/*
  Edits the requested TestCase from the database
*/

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).send({ message: 'Only PUT requests allowed' })
  }
  try{
    const data = req.body;
    const valid = await testCaseSchema.isValid(data);
    if (valid && ObjectId.isValid(data.testPlanId)){
        const result = testCaseSchema.cast(data);
        // Set ID strings to Mongo ObjectId's
        const id = ObjectId(result._id);
        const testPlanId = ObjectId(result.testPlanId);
        const BOM = result.BOM.map(device => {
          return {...device, deviceId: ObjectId(device.deviceId)}
        });
        const tests = result.tests.map(testId => ObjectId(testId));
        // Create the database query and replacement object
        const query = {_id: id};
        const newTestCase = {...result , _id: id, testPlanId:testPlanId, BOM:BOM, tests:tests};
        // Update the Database w/ new TestCase
        const db = await connectToDb();
        await db.collection("testCases").replaceOne(query, newTestCase);
        res.status(200).send({message: "Success!"});
    } else {
        res.status(422).send({message: 'Input not in right format'})
    }
  } catch (err) {
        res.status(500).send(err);
  }
};