import {testSchema} from "../../schemas/testSchema";
import connectToDb from "../../util/mongodb";
const { ObjectId } = require('mongodb');


export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
    }
    else {
        const client = await connectToDb();
        try {
          await testSchema.isValid(req.body).then(async function (valid) {
            if (valid && ObjectId.isValid(req.body.testCaseId) ) {
              const test = testSchema.cast(req.body);
              const testCaseId = ObjectId(req.body.testCaseId);
              const result = await client.collection('tests').insertOne({...test, testCaseId: testCaseId});
              // Push the test plan into the test case array as well
              await client.collection('testCases').updateOne(
                { "_id": testCaseId }, // query matching , refId should be "ObjectId" type
                { $push: { tests: result.insertedId}} // arr will be array of objects
                );
              res.status(200).send({message: result});
            }
            else {
              console.log(req.body)
              res.status(422).send({message: 'Input not in right format'})
            }
          })
          
        } catch (err) {
          console.log(err)
          res.status(500).send(err);
        }
    }
}