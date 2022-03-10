import { ObjectId } from "bson";
import {bomDeviceSchema} from "../../schemas/bomDeviceSchema";
import connectToDb from "../../util/mongodb";

export default async function handler(req, res) {
    console.log(req?.body)
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
    }
  

    // Assume that the device has not been added to the BOM before
    
    try {
      const data = req.body;
      console.log("data in api", data)
      const client = await connectToDb();
      if (ObjectId.isValid(data.testCaseId)) {
        const testCaseId = ObjectId(data.testCaseId);
        if (Array.isArray(data.devices)){
          for (let i=0; i<data.devices.length;i++){
            let device = data.devices[i];
            const valid = await bomDeviceSchema.isValid(device);
            if (valid){
              device.deviceId = ObjectId(device.deviceId);
              // console.log("device in for loop", device);
              // Push a new device into BOM of the corresponding test case
              const result = await client.collection('testCases').updateOne(
                { "_id": testCaseId }, // query matching , refId should be "ObjectId" type
                { $push: { BOM: device}} // arr will be array of objects
              );
              console.log(result);
            } else{
              console.log("device not valid ", i);
            }
          }
        } else{
          throw new Error("devices variable is not an array");
        }

        return ;
      }
      else {
          throw new Error('Test case id is invalid')
      }
    } catch (err) {
        throw err
    }
  }