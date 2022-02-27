import {testSchema} from "../schemas/testSchema";
import {testCaseSchema} from "../schemas/testCaseSchema";
import {testPlanSchema} from "../schemas/testPlanSchema";
import {engagementSchema} from "../schemas/engagementSchema";
import connectToDb from "./mongodb";
import { resultSchema } from "../schemas/resultSchema";
const { ObjectId } = require('mongodb');

export async function addResult(data) {
    try {
        const client = await connectToDb();
        const valid = await resultSchema.isValid(data)
        if (valid && ObjectId.isValid(data.testId) ) {
            const id = ObjectId(data._id);
            const testResult = resultSchema.cast(data);
            const testId = ObjectId(data.testId);
            const result = await client.collection('result').insertOne({...testResult, _id: id, testId: testId});
            // Push the test plan into the test case array as well
            await client.collection('tests').updateOne(
                { "_id": testId }, // query matching , refId should be "ObjectId" type
                {$push: { results: result.insertedId}} // arr will be array of objects
            );
            await client.collection('tests').updateOne(
                { "_id": testId }, // query matching , refId should be "ObjectId" type
                { $set: { resultStatus: testResult.resultStatus}}
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


export async function addTest(data) {
    try {
        const client = await connectToDb();
        const valid = await testSchema.isValid(data)
        if (valid && ObjectId.isValid(data.testCaseId) ) {
            const id = ObjectId(data._id);
            const test = testSchema.cast(data);
            const testCaseId = ObjectId(data.testCaseId);
            const result = await client.collection('tests').insertOne({...test, _id: id, testCaseId: testCaseId});
            // Push the test plan into the test case array as well
            await client.collection('testCases').updateOne(
                { "_id": testCaseId }, // query matching , refId should be "ObjectId" type
                { $push: { tests: ObjectId(result.insertedId)}} // arr will be array of objects
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
            const id = ObjectId(data._id);
            const testPlanId = ObjectId(data.testPlanId);
            // TODO: this is code that should be in clone function
            // for (const i in testCase.tests) {
            //     if (!ObjectId.isValid(testCase.tests[i])) {
                    
            //         throw new Error('Invalid Test Id')
            //     }
            // }

            // for (const i in testCase.BOM) {
            //     if (!ObjectId.isValid(testCase.BOM[i].deviceId)) {
            //         throw new Error('Invalid Device Id')
            //     }
            // }
            // const BOM = testCase.BOM.map(device => {
            //     return {...device, deviceId: ObjectId(device.deviceId)}
            //   });
            // const result = await client.collection('testCases').insertOne({...testCase, testPlanId: testPlanId, BOM: BOM});
            
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

export async function addTestPlan(data) {
    try {
        const client = await connectToDb();
        const valid = await testPlanSchema.isValid(data);
        if (valid && ObjectId.isValid(data.engagementId)){
            const testPlan = testPlanSchema.cast(data);
            const id = ObjectId(data._id);
            const engagementId = ObjectId(data.engagementId);
            // for (const i in testPlan.summaryBOM) {
            //     if (!ObjectId.isValid(testPlan.summaryBOM[i].deviceId)) {
                    
            //         throw new Error('Invalid Device Id')
            //     }
            // }
            // const SummaryBOM = testPlan.summaryBOM.map(device => {
            //     return {...device, deviceId: ObjectId(device.deviceId)};
            // }); 

            const result = await client.collection('testPlan').insertOne({...testPlan,_id: id, engagementId: engagementId});
            
            // if this test plan is active, update old test plan to not active and engagement points to new test plan id 
            if (data.isActive){
                const oldTestPlanId = await client.collection('engagments').findOne({ "_id": engagementId }, {testPlanId:1});
                const updateOldResult = await client.collection('testPlan').updateOne(
                { "_id": oldTestPlanId }, 
                { $set: { isActive: false}} 
                );

                const engagementResult = await client.collection('engagements').updateOne(
                    { "_id": engagementId }, 
                    { $set: { testPlanId: result.insertedId}} // update the active test plan id in engagement
                    );
            }
            
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
export async function addEngagement(data) {
    try {
        const client = await connectToDb();
        const valid = await engagementSchema.isValid(data);
        if (valid){
            const engagement = engagementSchema.cast(data);
            const id = ObjectId(data._id);
            const result = await client.collection('engagements').insertOne({...engagement, _id:id});
            return result;
        }
        else {
            throw new Error('Data not in right format');
        }
    } catch (err) {
        throw err
    }
}