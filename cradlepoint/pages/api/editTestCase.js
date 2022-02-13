const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {testCaseSchema} from "../../schemas/testCaseSchema";
/*
  Edits the requested TestCase from the database
*/


/*
TODO(?)/Important note: 
all the BOM and tests related checks and maps are commented out and potentially should be deleted. This is my reasoning:
- this function will be called ONLY from the test case details page EDIT button, which only allows you to edit the text fields
- If user wants to edit the tests or BOMs, they can do so directly using editTest or editBOM (not implemented yet as of 2/13)
- If they want to delete a test or BOM, we have/are working on separate delete endpoints
*/

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).send({ message: 'Only PUT requests allowed' })
  }
  try{
    const data = req.body;
    // Check that data is formatted correctly
    const valid = await testCaseSchema.isValid(data);

    // TODO: Delete later (?)
    // Check that all Id strings are Valid Mongo Object Ids
    // const validDevices = !data.BOM.map((dev) =>ObjectId.isValid(dev.deviceId)).includes(false);
    // const validTests = !data.tests.map((str) =>ObjectId.isValid(str)).includes(false);
    // const validObjectIds = validDevices && validTests && ObjectId.isValid(data.testPlanId) && ObjectId.isValid(data._id);
    const validObjectIds = ObjectId.isValid(data.testPlanId) && ObjectId.isValid(data._id);
    if (valid && validObjectIds){
        const validData = testCaseSchema.cast(data);
        // Set ID strings to Mongo ObjectId's
        const id = ObjectId(validData._id);
        const testPlanId = ObjectId(validData.testPlanId);

        // TODO: Delete later (?)
        // const BOM = validData.BOM.map(device => {
        //   return {...device, deviceId: ObjectId(device.deviceId)}
        // });
        // const tests = validData.tests.map(testId => ObjectId(testId));
        
        // Create the database query and replacement object
        const query = {_id: id};
        const newTestCase = {...validData , _id: id, testPlanId:testPlanId};
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