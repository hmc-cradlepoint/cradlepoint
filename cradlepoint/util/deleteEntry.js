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
    // TODO: parent not deleting
    try {
        const client = await connectToDb();
        const id = ObjectId(data._id);
        const parentId = ObjectId(data.parentTestPlanId);
        const result = await client.collection('testCases').deleteOne({"_id": id});
        // Delete result id from parent 'testPlan' field
        await client.collection('testPlan').updateOne(
            { "_id": parentId },
            { $pull: {tests: id} }
        );
        return result;
    } catch (err) {
        throw err;
    }
}

export async function deleteTestPlan(data) {
    // TODO: parent not deleting
    try {
        const client = await connectToDb();
        const id = ObjectId(data._id);
        const parentId = ObjectId(data.parentEngagementId);
        const result = await client.collection('testPlan').deleteOne({"_id": id});
        // Delete result id from parent 'engagement' field
        await client.collection('engagements').updateOne(
            { "_id": parentId },
            { $pull: {tests: id} }
        );
        return result;
    } catch (err) {
        throw err;
    }
}

export async function deleteEngagement(data) {
    // TODO
}

// BOMs
export async function deleteTestCaseBOM(data) {
    try {
        const client = await connectToDb();
        const deviceId = ObjectId(data._id);
        const parentId = ObjectId(data.parentTestCaseId);
        // TODO: delete, deletes entire device. but need an edit button
        await client.collection('testCases').updateOne(
            { "_id": parentId },
            { $pull: { BOM: deviceId } },
        );
        return result;
    } catch (err) {
        throw err;
    }
}
