const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {engagementSchema} from "../../schemas/engagementSchema";
/*
  Edits the requested engagement from the database
*/
// const query = { '_id': ObjectId("617249b199915be1b771aca1") };
// const data = {
//   "_id": "617249b199915be1b771aca1", 
//   "statusCode": 2,
//   "engagementDetails": "Test Details 2",
//   "SE": "1234",
//   "POC_Engineer": "2345",
//   "customer": "Big Finance",
//   "SFDC": "https://cradlepoint.lightning.force.com/lightning/r/Opportunity/006380...",
//   "BOM": [""],
//   "testPlanId": "61724e5599915be1b771acb2",
//   "createdOn": "2021-11-20T15:00:00.000Z"
//   //new Date(2021, 10, 20, 7, 0, 0, 0)
// }; 

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
  }
  try{
    const data = req.body;
    const valid = await engagementSchema.isValid(data);
    if (valid && ObjectId.isValid(data.testPlanId)){
      const result = engagementSchema.cast(data);
      // Set ID strings to Mongo ObjectId's
      const newId = ObjectId(result._id);
      const newTestPlanId = ObjectId(result.testPlanId);
      const query = {_id: newId};
      delete result._id;
      delete result.testPlanId;
      const engagement = {_id: newId, testPlanId:newTestPlanId, ...result };
      // Update the Database w/ new Engagement
      const db = await connectToDb();
      await db.collection("engagements").replaceOne(query, engagement);
      //res.json(engagement);
      res.status(200).send({message: "Success!"});
    } else {
      res.status(422).send({message: 'Input not in right format'})
    }

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};