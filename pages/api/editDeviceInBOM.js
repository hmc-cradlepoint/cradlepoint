const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import {bomDeviceSchema} from "../../schemas/bomDeviceSchema";
/*
  Edits the requested test from the database
*/

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).send({ message: 'Only PUT requests allowed' })
  }
  try{
    const data = req.body;
    
    const client = await connectToDb();
    
    if (ObjectId.isValid(data.testCaseId) && ObjectId.isValid(data.testPlanId)) {
        const testCaseId = ObjectId(data.testCaseId);
        const testPlanId = ObjectId(data.testPlanId);
        let device = data.devices[0];
        const valid = await bomDeviceSchema.isValid(device);
        if (valid){
            device.deviceId = ObjectId(device.deviceId);
            device._id = ObjectId(device._id);
            // Update the corresponding device of the BOM
            const testCaseResult = await client.collection('testCases').updateOne(
                { "_id": testCaseId,  "BOM._id" :  device._id }, // query matching , refId should be "ObjectId" type
                { $set :  {"BOM.$": device}},
            );
          
            // get all test cases belonging to the same test plan
            const testCases = (await client.collection('testPlan').findOne({"_id": testPlanId })).testCases;

            // iterate through all test cases to find the max quantity of the specific device 
            let maxQuantity = device.quantity;
            for (let i=0; i<testCases.length;i++){
                let BOM = (await client.collection('testCases').findOne({"_id": testCases[i] })).BOM;
                BOM = BOM.filter(d => (d.isOptional === device.isOptional) && d.deviceId.equals(device.deviceId));
                maxQuantity =  (BOM.length>0)?Math.max(BOM[0].quantity, maxQuantity):maxQuantity;
            }
            device.quantity = maxQuantity;
            console.log("maxQuant", device.quantity)

            // update the summaryBOM correspondingly
            const summaryBomResult = await client.collection('testPlan').updateOne(
              { "_id": testPlanId,  
                "summaryBOM.deviceId" :  device.deviceId, 
                "summaryBOM.isOptional": device.isOptional
              }, 
              { $set :  {"summaryBOM.$": device}},
            );

            console.log(summaryBomResult)

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