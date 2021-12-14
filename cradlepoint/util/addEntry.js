import {testSchema} from "../schemas/testSchema";
import {testCaseSchema} from "../schemas/testCaseSchema";
import connectToDb from "./mongodb";
const { ObjectId } = require('mongodb');

export async function addTest(data) {
    try {
        const client = await connectToDb();
        const valid = await testSchema.isValid(data)
        if (valid && ObjectId.isValid(data.testCaseId) ) {
            const test = testSchema.cast(data);
            for (const result in test.results) {
                if (!ObjectId.isValid(result)) {
                    throw new Error('Invalid Result Id')
                }
            }
            const testCaseId = ObjectId(data.testCaseId);
            const result = await client.collection('tests').insertOne({...test, testCaseId: testCaseId});
            // Push the test plan into the test case array as well
            await client.collection('testCases').updateOne(
                { "_id": testCaseId }, // query matching , refId should be "ObjectId" type
                { $push: { tests: result.insertedId}} // arr will be array of objects
            );
            return result
        }
        else {
            throw new Error('Data is not in right format')
        }
        
    } catch (err) {
        throw err
    }
}

export async function addTestCase(data) {
    try {
        const client = await connectToDb();
        const valid = await testCaseSchema.isValid(data)
        if (valid && ObjectId.isValid(data.testPlanId) ) {
            const testCase = testCaseSchema.cast(data);
            for (const i in testCase.tests) {
                if (!ObjectId.isValid(testCase.tests[i])) {
                    
                    throw new Error('Invalid Test Id')
                }
            }
            const testPlanId = ObjectId(data.testPlanId);
            for (const i in testCase.BOM) {
                if (!ObjectId.isValid(testCase.BOM[i].deviceId)) {
                    throw new Error('Invalid Device Id')
                }
            }
            const BOM = testCase.BOM.map(device => {
                return {...device, deviceId: ObjectId(device.deviceId)}
              });
            const result = await client.collection('testCases').insertOne({...testCase, testPlanId: testPlanId, BOM: BOM});
            
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