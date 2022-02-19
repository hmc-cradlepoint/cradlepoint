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

export async function deleteTestPlan(data) {
    try {
        const client = await connectToDb();
        const valid = await testPlanSchema.isValid(data);
        if (valid && ObjectId.isValid(data.engagementId)){
            const testPlan = testPlanSchema.cast(data);
            for (const i in testPlan.summaryBOM) {
                if (!ObjectId.isValid(testPlan.summaryBOM[i].deviceId)) {
                    
                    throw new Error('Invalid Device Id')
                }
            }
            const SummaryBOM = testPlan.summaryBOM.map(device => {
                return {...device, deviceId: ObjectId(device.deviceId)};
            }); 

            const result = await client.collection('testPlan').insertOne({...testPlan, SummaryBOM});
            return result;
        }
        else {
            throw new Error('input nor in right format')
        }
    } catch (err) {
        throw err
    }

}

// TODO: Possibly add Active test plan as we make an engagement
export async function deleteEngagement(data) {
    try {
        const client = await connectToDb();
        const valid = await engagementSchema.isValid(data);
        if (valid && ObjectId.isValid(data.testPlanId)){
            const engagement = engagementSchema.cast(data);
            const result = await client.collection('engagements').insertOne(engagement);
            return result;
        }
        else {
            throw new Error('Data not in right format');
        }
    } catch (err) {
        throw err
    }
}