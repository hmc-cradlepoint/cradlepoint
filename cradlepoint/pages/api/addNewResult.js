import {resultSchema} from "../../schemas/resultSchema";
import connectToDb from "../../util/mongodb";
const { ObjectId } = require('mongodb');


export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
    }
    else {
        const client = await connectToDb();
        try {
          await resultSchema.isValid(req.body).then(async function (valid) {
            if (valid && ObjectId.isValid(req.body.testId) ) {
              const result = resultSchema.cast(req.body);
              const testId = ObjectId(req.body.testId);
              const response = await client.collection('result').insertOne({...result, testCaseId: testId});
              // Push the test plan into the test case array as well
              await client.collection('tests').updateOne(
                { "_id": testId }, // query matching , refId should be "ObjectId" type
                { $push: { results: response.insertedId}} // arr will be array of objects
                );
              res.status(200).send({message: response});
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