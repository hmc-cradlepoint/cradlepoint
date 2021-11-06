import connectToDb from "../../util/mongodb";
import {engagementSchema} from "../../schemas/engagementSchema"

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
    }
  
    const client = await connectToDb();
    try {
      const engagement = engagementSchema.cast({...req.body, statusCode: 1, BOM: []})

      await engagementSchema.isValid(engagement).then(async function (valid) {
        if (valid){
          const result = await client.collection('engagements').insertOne(engagement);
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