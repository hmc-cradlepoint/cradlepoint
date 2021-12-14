import connectToDb from "mongodb";
import {testPlanSchema} from "../schemas/testPlanSchema"

export default async function newTestPlan(params, res) {
    const client = await connectToDb();
    try {
      const testPlan = testPlanSchema.cast({...params})

      await testPlanSchema.isValid(testPlan).then(async function (valid) {
        if (valid){
          const result = await client.collection('testPlan').insertOne(testPlan);
          res.status(200).send({message: result});
        }
        else {
          res.status(422).send({message: 'Input not in right format'})
        }
      })
      
    } catch (err) {
      res.status(500).send(err);
    }
}
