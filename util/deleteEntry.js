import {testSchema} from "../schemas/testSchema";
import {testCaseSchema} from "../schemas/testCaseSchema";
import {testPlanSchema} from "../schemas/testPlanSchema";
import {engagementSchema} from "../schemas/engagementSchema";
import connectToDb from "./mongodb";
import { getTestCase } from "../pages/api/getTestCase";
import { getTestPlan } from "../pages/api/getTestPlan";
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

        // get all the child results and delete each of them
        const results = (await client.collection('tests').findOne({"_id": id })).results;
        for (let i=0; i<results.length;i++){
            const deleteChild = await deleteResult({
                "_id": results[i],
                "parentTestId": id,
            })
            console.log("delete result", deleteChild);
        }

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
        console.log("data in deleteTestCase", data)
        const client = await connectToDb();
        const id = ObjectId(data._id);
        const parentId = ObjectId(data.parentTestPlanId);
        const testCaseData = (await getTestCase(id))[0];
        console.log(testCaseData);

         // get all the child tests and delete each of them
        const tests = testCaseData.tests;
        for (let i=0; i<tests.length;i++){
            const deleteChild = await deleteTest({
                "_id": tests[i],
                "parentTestCaseId": id,
            })
            console.log("delete test", deleteChild)
        }

        
        // get all the BOM device and delete each of them so summaryBOM can be updated
        const BOM = (JSON.stringify(testCaseData.BOM) === '[{}]')?[]:testCaseData.BOM;
        for (let i=0; i<BOM.length;i++){
            const deleteChild = await deleteTestCaseBOM({
                ...BOM[i],
                "parentTestCaseId": id,
            })
            console.log("delete device", deleteChild)
        }

        // Delete from parent 'testPlan' field
        const testPlanUpdate = await client.collection('testPlan').updateOne(
            { "_id": parentId },
            { $pull: {testCases: id}}
        );
        console.log("delete test case id from test plan", testPlanUpdate);

        const deleteTestCase = await client.collection('testCases').deleteOne({"_id": id});
        console.log("delete test case object", deleteTestCase)
        return deleteTestCase;
        // return deleteTestCase;
    } catch (err) {
        throw err;
    }
}

export async function deleteTestPlan(data) {
    try {
        const client = await connectToDb();
        const id = ObjectId(data._id);
        const testPlanData = (await getTestPlan(id))[0];
        console.log(testPlanData)
        // get all the child test cases and delete each of them
        const testCases = testPlanData.testCases;
        for (let i=0; i<testCases.length;i++){
            const deleteChild = await deleteTestCase({
                "_id": testCases[i],
                "parentTestPlanId": id,
            })
            console.log("delete test case", deleteChild)
        }

        // TODO: Delete button is not added to the table for active test plan; this is a design
        // question of whether we should allow users to delete an active test plan. If this 
        // is allowed, we can uncomment the code below; delete otherwise.

        // // if test plan is active, need to delete the pointer from parent engagement
        // if (testPlanData.isActive){
        //     const engagementUpdate = await client.collection('engagements').updateOne(
        //         {"_id": ObjectId(testPlanData.engagementId)},
        //         {$unset: {testPlanId: ""}}
        //     );
        //     console.log("active test plan removed from engagement", engagementUpdate);
        // }

        // delete from test plan collection
        const result = await client.collection('testPlan').deleteOne({"_id": id});
        console.log("delete test plan object", result);

        return result;
    } catch (err) {
        throw err;
    }
}

export async function deleteEngagement(data) {
    try {
        const client = await connectToDb();
        const id = ObjectId(data._id);

        const testPlanId = (await client.collection('engagements').findOne({"_id": id })).testPlanId;
        
        const deleteChild = await deleteTestPlan({"_id": testPlanId})
        console.log("delete active test plan", deleteChild);

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
       const testCaseUpdate =  await client.collection('testCases').updateOne(
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
        
        let result;
        if (maxQuantity!=0){
            // edit quantity of device in summaryBOM if not 0
            summaryBomDevice.quantity = maxQuantity;
            result = await client.collection('testPlan').updateOne(
                { "_id": testPlanId,  
                  "summaryBOM.deviceId" :  deviceId, 
                  "summaryBOM.isOptional": data.isOptional
                }, 
                { $set :  {"summaryBOM.$": summaryBomDevice}},
              );       
        } else {
             // delete device in summaryBOM if no other test cases have this device
            result = await client.collection('testPlan').updateOne(
                { "_id": testPlanId}, 
                { $pull :  {summaryBOM: {_id: summaryBomDevice._id}}},
              );
        }
        console.log(result)
        return result;
    } catch (err) {
        throw err;
    }
}
