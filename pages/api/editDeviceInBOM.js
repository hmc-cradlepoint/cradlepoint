const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {bomDeviceSchema} from "../../schemas/bomDeviceSchema";
/*
  Edits the requested test from the database
*/
// TODO: does not support summaryBOM yet
export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).send({ message: 'Only PUT requests allowed' })
  }
  try{
    const data = req.body;
    
    const client = await connectToDb();
    if (ObjectId.isValid(data.testCaseId)) {
        const testCaseId = ObjectId(data.testCaseId);
        let device = data.devices[0];
        const valid = await bomDeviceSchema.isValid(device);
        if (valid){
            device.deviceId = ObjectId(device.deviceId);
            // Update the corresponding device of the BOM
            const result = await client.collection('testCases').updateOne(
                { "_id": testCaseId,  "BOM.deviceId" :  device.deviceId }, // query matching , refId should be "ObjectId" type
                { $set :  {"BOM.$": device}},
            );
        } else{
          res.status(422).send({message: "device not valid "});
        }
          res.status(200).send({message: "Success!"});
        } else {
          res.status(422).send({message: 'Input not in right format'});
        }
  } catch (err) {
    res.status(500).send(err);
  }
};