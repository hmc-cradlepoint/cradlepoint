import {testPlanSchema} from "../../schemas/testPlanSchema";
import connectToDb from "../../util/mongodb";


export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
    }
    else {
        const client = await connectToDb();
        try {
          const testPlan = testPlanSchema.cast({...req.body})
          await testPlanSchema.isValid(req.body).then(async function (valid) {
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
}