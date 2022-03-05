import {deviceSchema} from "../../schemas/deviceSchema";
import connectToDb from "../../util/mongodb";

export default async function handler(req, res) {
    console.log(req?.body)
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
    }
  
    try {
      const client = await connectToDb();
      const valid = await deviceSchema.isValid(req.body)
      if (valid) {
        const device = deviceSchema.cast(req.body);
        const response = await client.collection('device').insertOne(device);
        res.status(200).send({message: response});
      }
      else {
        throw new Error('Data is not in right format')
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }