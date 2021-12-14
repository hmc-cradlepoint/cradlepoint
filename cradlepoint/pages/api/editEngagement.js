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
    const validObjectIds = ObjectId.isValid(data.testPlanId) && ObjectId.isValid(data._id);
    if (valid && validObjectIds){
      const validData = engagementSchema.cast(data);
      // Set ID strings to Mongo ObjectId's
      const id = ObjectId(validData._id);
      const testplanId = ObjectId(validData.testPlanId);
      // Create the database query and replacement object
      const query = {_id: id};
      const newEngagement = {...validData , _id: id, testPlanId:testplanId};
      // Update the Database w/ new Engagement
      const db = await connectToDb();
      await db.collection("engagements").replaceOne(query, newEngagement);
      res.status(200).send({message: "Success!"});
    } else {
      res.status(422).send({message: 'Input not in right format'})
    }
  } catch (err) {
    res.status(500).send(err);
  }
};