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
    // TODO: Does not do a deep ID validation for BOM or tests
    const validObjectIds = ObjectId.isValid(data.testPlanId) && ObjectId.isValid(data._id);
    if (valid && validObjectIds){
        const validData = testCaseSchema.cast(data);
        // Set ID strings to Mongo ObjectId's
        const id = ObjectId(validData._id);
        const testPlanId = ObjectId(validData.testPlanId);
        const BOM = validData.BOM.map(device => {
          return {...device, deviceId: ObjectId(device.deviceId)}
        });
        const tests = validData.tests.map(testId => ObjectId(testId));
        // Create the database query and replacement object
        const query = {_id: id};
        const newTestCase = {...validData , _id: id, testPlanId:testPlanId, BOM:BOM, tests:tests};
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