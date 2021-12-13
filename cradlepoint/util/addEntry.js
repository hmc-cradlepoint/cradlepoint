import {testSchema} from "../schemas/testSchema";
import connectToDb from "./mongodb";
const { ObjectId } = require('mongodb');

export const testMessage = 'test'

export async function addTest(data) {
    try {
        const client = await connectToDb();
        const valid = await testSchema.isValid(data)
        if (valid && ObjectId.isValid(data.testCaseId) ) {
            const test = testSchema.cast(data);
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
