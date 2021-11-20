const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {engagementSchema} from "../../schemas/engagementSchema";
/*
  Edits the requested engagement from the database
*/

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).send({ message: 'Only PUT requests allowed' })
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
      const engagement = {...result , _id: newId, testPlanId:newTestPlanId};
      // Update the Database w/ new Engagement
      const db = await connectToDb();
      await db.collection("engagements").replaceOne(query, engagement);
      res.status(200).send({message: "Success!"});
    } else {
      res.status(422).send({message: 'Input not in right format'})
    }
  } catch (err) {
    res.status(500).send(err);
  }
};