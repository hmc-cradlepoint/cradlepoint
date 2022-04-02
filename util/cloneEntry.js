import {testSchema} from "../schemas/testSchema";
import {testCaseSchema} from "../schemas/testCaseSchema";
import {testPlanSchema} from "../schemas/testPlanSchema";
import connectToDb from "./mongodb";
import { addTest } from "./addEntry";
const { ObjectId } = require('mongodb');

async function cloneTest(testCaseId, oldTests) {
    // iterate through all the tests of the original test case
    // clone them and add them to the new test case
    for (var i = 0; i < oldTests.length; i++) {
        const testId = oldTests[i];
        // ensure the test id is valid
        if (!ObjectId.isValid(ObjectId(testId))) {
            throw new Error('Invalid Test Id')
        }

        // get test details of the corresponding test from the Test Library
        var test;
        try {
            test = await (await fetch(`${process.env.HOST}/api/getLibraryTests?_id=${testId}`)).json()
            test = test[0];
        } catch {
            throw new Error("cannot get test corresponding to id")
        }

        // creating a new test id and make the parent test case id to the one we just created
        const newTestId = new ObjectId();
        test._id = newTestId.toString();
        test.testCaseId = testCaseId;
        test.results = [];
        // add the test to the test case
        const testResult = await addTest(test);
    }
    
    return "Cloned all tests";
}

async function cloneBOM(testPlanId, oldBOM, client) {
    // newBOM is the BOM for the new test case we are creating
    var newBOM = [];

    const originalTestCases = (await client.collection('testPlan').findOne({"_id": testPlanId })).testCases;
    
    // iterates through the original test case's BOM, verify that each device id is valid,
    // convert string deviceId to ObjectId, and push to the newBOM array
    for (var i = 0; i < oldBOM.length; i++) {
        let device = oldBOM[i];
        // give device a new id
        device._id = ObjectId();
        device.deviceId = ObjectId(device.deviceId)
        console.log("oldBOM[i]", oldBOM[i]);
        newBOM.push(oldBOM[i])
     
        // update the summaryBOM correspondingly by find the max quantity of this device among all the test cases of the 
        // current test plan
        let maxQuantity = device.quantity;
        for (let i=0; i<originalTestCases.length;i++){
            console.log("originalTestCase ", originalTestCases[i])
            let BOM = (await client.collection('testCases').findOne({"_id": originalTestCases[i] })).BOM;
            BOM = BOM.filter(d => (d.isOptional === device.isOptional) && d.deviceId.equals(device.deviceId));
            maxQuantity =  (BOM.length>0)?Math.max(BOM[0].quantity, maxQuantity):maxQuantity;
        }
        
        device.quantity = maxQuantity;
        // update summaryBOM with corresponding max quantity
        const summaryBomUpdate = await client.collection('testPlan').updateOne(
          { "_id": testPlanId,  
            "summaryBOM.deviceId" :  device.deviceId, 
            "summaryBOM.isOptional": device.isOptional
          }, 
          { $set :  {"summaryBOM.$": device}},
        );
        console.log("summaryBomUpate", summaryBomUpdate);

        // if summary BOM does not have the device yet, we insert directly 
        if (summaryBomUpdate.modifiedCount<1){
            const summaryBomInsert = await client.collection('testPlan').updateOne(
                { "_id": testPlanId}, 
                { $push: { summaryBOM: device}},
              );
            console.log("summaryBomInsert", summaryBomInsert);
        }
    }

    return newBOM;
}

export async function cloneTestCase(data) {
    try {
        const client = await connectToDb();
        const valid = await testCaseSchema.isValid(data)
        if (valid && ObjectId.isValid(data.testPlanId) ) {
            const testCase = testCaseSchema.cast(data);
            const id = ObjectId(data._id);
            const testPlanId = ObjectId(data.testPlanId);

            // create a new BOM and update summaryBOM of the test plan
            const newBOM = await cloneBOM(testPlanId, testCase.BOM, client);
            console.log("newBOM ", newBOM)
            // create new test case which starts initially with empty tests array and the new BOM
            const result = await client.collection('testCases').insertOne({...testCase, _id: id, testPlanId: testPlanId, tests:[], BOM: newBOM});
            console.log(result)
            
            const testResult = cloneTest(id, testCase.tests);
            console.log(testResult);
   
            // Push the test case into the test case array of its corresponding test plan
            const testPlanResult = await client.collection('testPlan').updateOne(
                { "_id": testPlanId }, // query matching , refId should be "ObjectId" type
                { $push: { testCases: result.insertedId}} // arr will be array of objects
                );
            console.log(testPlanResult)

            if (testPlanResult.modifiedCount != 1) {
                throw new Error('Test Plan not updated')
            }
            return result
        }
        else {
            throw new Error('Input not in right format')
        }
    } catch (err) {
        throw err
    }
}

export async function cloneTestPlan(data) {

    try {
        const client = await connectToDb();
        const valid = await testPlanSchema.isValid(data)
        console.log("data ", data);

        if (valid && ObjectId.isValid(data.engagementId) ) {
            const testPlan = testPlanSchema.cast(data);
            const id = ObjectId(data._id);
            const engagementId = ObjectId(data.engagementId);
            
            // create new test plan which starts initially with empty test cases array and the new summary BOM
            const result = await client.collection('testPlan').insertOne({...testPlan, _id: id, engagementId: engagementId, testCases:[], summaryBOM: []});
      
            // iterate through all the test cases of the original test plan
            // clone them and add them to the new test plan, while updating the summaryBOM
            for (var i = 0; i < testPlan.testCases.length; i++) {
                const testCaseId = testPlan.testCases[i];
                // ensure the test case id is valid
                if (!ObjectId.isValid(ObjectId(testCaseId))) {
                    throw new Error('Invalid Test Case Id')
                }

                // get test case details from the Test case Library
                var testCase;
                try {
                    testCase = await (await fetch(`${process.env.HOST}/api/getLibraryTestCases?_id=${testCaseId}`)).json()
                    testCase = testCase[0];
                } catch {
                    throw new Error("cannot get test corresponding to id")
                }

                // creating a new test case id and set the parent test plan id to the one we just created
                const newTestCaseId = new ObjectId();
                testCase._id = newTestCaseId.toString();
                testCase.testPlanId = data._id;
           
                // clone the child test case
                await cloneTestCase(testCase);
            }
        
            // check if we want to make the current test plan active, if so, we inactivate the old test plan of the engagement
            // and set testPlanId to the new test plan id
            if (data.isActive){
                // inactivate the old test plan of the engagement
                const oldTestPlan = await (await fetch(`${process.env.HOST}/api/getEngagement?_id=${engagementId}`)).json();
                if (oldTestPlan.length>0){
                    const oldTestPlanId = ObjectId(oldTestPlan[0].testPlanId);
                    await client.collection('testPlan').updateOne({ "_id": oldTestPlanId}, 
                                                                { $set: { "isActive": false}});
                }
                
                // Update the active test plan of the engagement to the current one
                await client.collection('engagements').updateOne(
                { "_id": engagementId }, 
                { $set: { testPlanId: id}} 
                );
            }
            return result
        }
        else {
            throw new Error('Input not in right format')
        }
    } catch (err) {
        throw err
    }
}

// TODO: Possibly add Active test plan as we make an engagement
export async function cloneEngagement(data) {

}