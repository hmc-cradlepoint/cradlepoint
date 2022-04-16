import {testSchema} from "../schemas/testSchema";
import {testCaseSchema} from "../schemas/testCaseSchema";
import {testPlanSchema} from "../schemas/testPlanSchema";
import {engagementSchema} from "../schemas/engagementSchema";
import connectToDb from "./mongodb";
const { ObjectId } = require('mongodb');

export async function deleteResult(data) {
    try {
        const client = await connectToDb();
        const id = ObjectId(data._id);
        const parentId = ObjectId(data.parentTestId);
        const result = await client.collection('result').deleteOne({"_id": id});
        // Delete result id from parent 'tests' field
        await client.collection('tests').updateOne(
            { "_id": parentId },
            { $pull: {results: id} }
        );
        return result;
    } catch (err) {
        throw err;
    }
}

export async function deleteTest(data) {
    try {
        const client = await connectToDb();
        const id = ObjectId(data._id);
        const parentId = ObjectId(data.parentTestCaseId);
        const result = await client.collection('tests').deleteOne({"_id": id});
        // Delete result id from parent 'testCases' field
        await client.collection('testCases').updateOne(
            { "_id": parentId },
            { $pull: {tests: id} }
        );
        return result;
    } catch (err) {
        throw err;
    }
}

export async function deleteTestCase(data) {
    try {
        const client = await connectToDb();
        const id = ObjectId(data._id);
        const parentId = ObjectId(data.parentTestPlanId);
        const result = await client.collection('testCases').deleteOne({"_id": id});
        // Delete result id from parent 'testPlan' field
        await client.collection('testPlan').updateOne(
            { "_id": parentId },
            { $pull: {testCases: id} }
        );
        return result;
    } catch (err) {
        throw err;
    }
}

export async function deleteTestPlan(data) {
    try {
        const client = await connectToDb();
        const id = ObjectId(data._id);
        // parent engagement does not keep track of archived test plans, so just delete from test plan collection.
        const result = await client.collection('testPlan').deleteOne({"_id": id});
        return result;
    } catch (err) {
        throw err;
    }
}

export async function deleteEngagement(data) {
    try {
        const client = await connectToDb();
        const id = ObjectId(data._id);
        // delete engagement from engagements collection
        const result = await client.collection('engagements').deleteOne({"_id": id});
        return result;
    } catch (err) {
        throw err;
    }
}

// BOMs
export async function deleteTestCaseBOM(data) {
    try {
        const client = await connectToDb();
        const _id = ObjectId(data._id);
        const deviceId = ObjectId(data.deviceId);
        const parentId = ObjectId(data.parentTestCaseId);

        // remove device from test case
        await client.collection('testCases').updateOne(
            { "_id": parentId },
            { $pull: { BOM: {_id: _id }} },
        );
       
        // get the test plan corresponding to this test case (for updating summaryBOM purposes)
        const testPlanId = (await client.collection('testCases').findOne({"_id": parentId })).testPlanId;
        const testPlan = (await client.collection('testPlan').findOne({"_id": testPlanId }));
        const testCases = testPlan.testCases;
        const summaryBOM = testPlan.summaryBOM;

        // find the new maximum quantity
        let maxQuantity = 0;
        for (let i=0; i<testCases.length;i++){
            let BOM = (await client.collection('testCases').findOne({"_id": testCases[i] })).BOM;
            BOM = BOM.filter(d => (d.isOptional === data.isOptional) && d.deviceId.equals(deviceId));
            maxQuantity =  (BOM.length>0)?Math.max(BOM[0].quantity, maxQuantity):maxQuantity;
        }

        // get the device in summaryBOM corresponding to this device in the test case
        const summaryBomDevice = summaryBOM.filter(d => (d.isOptional === data.isOptional) && d.deviceId.equals(deviceId))[0];      
        
        if (maxQuantity!=0){
            // edit quantity of device in summaryBOM if not 0
            summaryBomDevice.quantity = maxQuantity;
            const result = await client.collection('testPlan').updateOne(
                { "_id": testPlanId,  
                  "summaryBOM.deviceId" :  deviceId, 
                  "summaryBOM.isOptional": data.isOptional
                }, 
                { $set :  {"summaryBOM.$": summaryBomDevice}},
              );        
           
        } else {
             // delete device in summaryBOM if no other test cases have this device
            const result = await client.collection('testPlan').updateOne(
                { "_id": testPlanId}, 
                { $pull :  {summaryBOM: {_id: summaryBomDevice._id}}},
              );
        }
        console.log(result);
        return result;
    } catch (err) {
        throw err;
    }
}
