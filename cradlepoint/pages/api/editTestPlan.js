const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {testPlanSchema} from "../../schemas/testPlanSchema";
/*
  Edits the requested TestPlan from the database
*/

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).send({ message: 'Only PUT requests allowed' })
  }
  try{
    const data = req.body;
    const valid = await testPlanSchema.isValid(data);
    if (valid){
      const result = testPlanSchema.cast(data);
      // Set ID strings to Mongo ObjectId's
      const id = ObjectId(result._id);
      const query = {_id: id};
      const testPlan = {...result, _id: id };
      // Update the Database w/ new TestPlan
      const db = await connectToDb();
      await db.collection("testPlan").replaceOne(query, testPlan);
      res.status(200).send({message: "Success!"});
    } else {
      res.status(422).send({message: 'Input not in right format'})
    }
  } catch (err) {
    res.status(500).send(err);
  }
};