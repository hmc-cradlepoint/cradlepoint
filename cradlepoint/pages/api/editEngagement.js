const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {engagementSchema} from "../../schemas/engagementSchema";
/*
  Gets the requested test plan from the database
*/
const query = { '_id': ObjectId("617249b199915be1b771aca1") };
const updates = {
  '_id': "617249b199915be1b771aca1", 
  'statusCode': 2,
  'engagementDetails': 'Test Details 2',
  'SE': '1234',
  'POC_Engineer': '2345',
  'customer': 'Big Finance',
  'SFDC': 'https://cradlepoint.lightning.force.com/lightning/r/Opportunity/006380...',
  'BOM': [""],
  'testPlanId': "61724e5599915be1b771acb2",
  'createdOn': new Date(2021, 10, 20, 7, 0, 0, 0)
}; 

export default async (req, res) => {
  // if (req.method !== 'POST') {
  //   res.status(405).send({ message: 'Only POST requests allowed' })
  // }
  try{
    const valid = await engagementSchema.isValid(updates);
    // console.log("Schema is Valid:", valid ); 
    // console.log("Id is Valid:", ObjectId.isValid(updates.testPlanId));
    if (valid && ObjectId.isValid(updates.testPlanId)){
      const result = engagementSchema.cast(updates);
      // Set ID strings to Mongo ObjectId's
      const newId = ObjectId(result._id);
      const newTestPlanId = ObjectId(result.testPlanId);
      delete result._id;
      delete result.testPlanId;
      const engagement = {newId, newTestPlanId, ...result };
      // Update the Database w/ new Engagement
      const db = await connectToDb();
      await db.collection("engagements").replaceOne(query, updates);
      res.json(engagement);
    }

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};