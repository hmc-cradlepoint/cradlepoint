const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {testPlanSchema} from "../../schemas/testPlanSchema";
/*
  Edits the requested TestPlan from the database
*/
// const data = {
//   "_id": "6172500699915be1b771acb3", 
//   "name": "LTE Failover",
//   "detailedDescription": "Test failover to LTE during upstream failure",
//   "version": "1234",
//   "deviceConfig": "[{'system':{'system_id':'LTE Router'}}, []]",
//   "customerFeedback": "Works as expected",
//   "testCases": [""],
//   "authors": [""],
//   "isActive": false,
//   "createdOn": "2021-10-21T07:00:00.000Z"
// }; 

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
  }
  try{
    const data = req.body;
    const valid = await testPlanSchema.isValid(data);
    if (valid){
      const result = testPlanSchema.cast(data);
      // Set ID strings to Mongo ObjectId's
      const newId = ObjectId(result._id);
      const query = {_id: newId};
      delete result._id;
      const testPlan = {_id: newId, ...result };
      // Update the Database w/ new TestPlan
      const db = await connectToDb();
      await db.collection("testPlan").replaceOne(query, testPlan);
      //res.json(testPlan);
      res.status(200).send({message: "Success!"});
    } else {
      res.status(422).send({message: 'Input not in right format'})
    }

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};