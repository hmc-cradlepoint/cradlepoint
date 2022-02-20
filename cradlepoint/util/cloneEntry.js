import {testSchema} from "../schemas/testSchema";
import {testCaseSchema} from "../schemas/testCaseSchema";
import {testPlanSchema} from "../schemas/testPlanSchema";
import {engagementSchema} from "../schemas/engagementSchema";
import connectToDb from "./mongodb";
import { resultSchema } from "../schemas/resultSchema";
import { addTest } from "./addEntry";
const { ObjectId } = require('mongodb');

/**Clone function
 * test plan
 * 
 * create new test plan (but with empty test case array)
 * get test case from original test plan
 * add new test case to the new test plan with the info of original test case (duplicate)
 *  - create new test case 
 *  - add new test case to the test plan id array
 * get test from original test case
 * add new test to the new test case
 * 
 */

export async function cloneTest(data) {
    
}

export async function cloneBOM(data) {
    
}

export async function cloneTestCase(data) {

    try {
        const client = await connectToDb();
        const valid = await testCaseSchema.isValid(data)
        if (valid && ObjectId.isValid(data.testPlanId) ) {
            const testCase = testCaseSchema.cast(data);
            const id = ObjectId(data._id);
            const testPlanId = ObjectId(data.testPlanId);
            
            // newBOM is the BOM for the new test case we are creating
            var newBOM = [];

            // iterates through the original test case's BOM, verify that each device id is valid,
            // convert string deviceId to ObjectId, and push to the newBOM array
            for (var i = 0; i < testCase.BOM.length; i++) {
                const deviceId = ObjectId(testCase.BOM[i].deviceId);
                if (!ObjectId.isValid(deviceId)) {
                    throw new Error('Invalid Device Id')
                }
                newBOM.push(testCase.BOM[i])
                newBOM[i].deviceId = deviceId
            }
            
            // create new test case which starts initially with empty tests array and the new BOM
            const result = await client.collection('testCases').insertOne({...testCase, _id: id, testPlanId: testPlanId, tests:[], BOM: newBOM});
    
            // iterate through all the tests of the original test case
            // clone them and add them to the new test case
            for (var i = 0; i < testCase.tests.length; i++) {
                const testId = testCase.tests[i];
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
                test.testCaseId = data._id;
                test.results = [];
                // add the test to the test case
                const testResult = await addTest(test);
            }
            
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
}

// TODO: Possibly add Active test plan as we make an engagement
export async function cloneEngagement(data) {

}