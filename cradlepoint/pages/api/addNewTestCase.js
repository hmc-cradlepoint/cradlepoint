import {testCaseSchema} from "../../schemas/testCaseSchema";
import connectToDb from "../../util/mongodb";
const { ObjectId } = require('mongodb');


export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
    }
    else {
        const client = await connectToDb();
        try {
          await testCaseSchema.isValid(req.body).then(async function (valid) {
            if (valid && ObjectId.isValid(req.body.testPlanId) ) {
              const testCase = testCaseSchema.cast(req.body);
              const testPlanId = ObjectId(req.body.testPlanId);
              const result = await client.collection('testCases').insertOne({...testCase, testPlanId: testPlanId});
              // Push the test plan into the test case array as well
              await client.collection('testPlan').updateOne(
                { "_id": testPlanId }, // query matching , refId should be "ObjectId" type
                { $push: { testCases: result.insertedId}} // arr will be array of objects
                );
              res.status(200).send({message: result});
            }
            else {
              res.status(422).send({message: 'Input not in right format'})
            }
          })
          
        } catch (err) {
          console.log(err)
          res.status(500).send(err);
        }
    }
}