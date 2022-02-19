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
            var newTests = [];
            for (var i = 0; i < testCase.tests.length; i++) {
                const testId = testCase.tests[i];
                if (!ObjectId.isValid(ObjectId(testId))) {
                    throw new Error('Invalid Test Id')
                }
                const newTestId = new ObjectId();
                var test;
                try {
                    test = await (await fetch(`${process.env.HOST}/api/getLibraryTests?_id=${testId}`)).json()
                } catch {
                    throw new Error("cannot get test corresponding to id")
                }

                test._id = newTestId.toString();
                test.testCaseId = data._id;
                console.log("HI");
                throw new Error("updated test id and test case id " + JSON.stringify(test));

                // console.log("test ", test);
                // addTest(test);
                // newTests.push(newTestId);
            }

            // for (const i in testCase.BOM) {
            //     if (!ObjectId.isValid(testCase.BOM[i].deviceId)) {
            //         throw new Error('Invalid Device Id')
            //     }
            // }
            // const BOM = testCase.BOM.map(device => {
            //     return {...device, deviceId: ObjectId(device.deviceId)}
            //   });
            
            // TODO: should replace result with the following line once cloneTest is done
            // const result = await client.collection('testCases').insertOne({...testCase, testPlanId: testPlanId, tests: newTests, BOM: BOM});
            const result = await client.collection('testCases').insertOne({...testCase, _id: id, testPlanId: testPlanId});
            // Push the test plan into the test case array as well
            const testPlanResult = await client.collection('testPlan').updateOne(
                { "_id": testPlanId }, // query matching , refId should be "ObjectId" type
                { $push: { testCases: result.insertedId}} // arr will be array of objects
                );
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