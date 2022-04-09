import { testSchema } from "../schemas/testSchema";
import { testCaseSchema } from "../schemas/testCaseSchema";
import { testPlanSchema } from "../schemas/testPlanSchema";
import { engagementSchema } from "../schemas/engagementSchema";
import connectToDb from "./mongodb";
import { resultSchema } from "../schemas/resultSchema";
import { bomDeviceSchema } from "../schemas/bomDeviceSchema";
const { ObjectId } = require('mongodb');

export async function addResult(data) {
    try {
        const client = await connectToDb();
        const valid = await resultSchema.isValid(data)
        if (valid && ObjectId.isValid(data.testId)) {
            // DYLAN: Mongo will add an _id field to new objects, not sure why this line is here
            const id = ObjectId(data._id);
            const testResult = resultSchema.cast(data);
            const testId = ObjectId(data.testId);
            const result = await client.collection('result').insertOne({ ...testResult, _id: id, testId: testId });
            // Push the test plan into the test case array as well
            await client.collection('tests').updateOne(
                { "_id": testId }, // query matching , refId should be "ObjectId" type
                { $push: { results: result.insertedId } } // arr will be array of objects
            );
            await client.collection('tests').updateOne(
                { "_id": testId }, // query matching , refId should be "ObjectId" type
                { $set: { resultStatus: testResult.resultStatus } }
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
        if (valid && ObjectId.isValid(data.testCaseId)) {
            // DYLAN: Mongo will add an _id field to new objects, not sure why this line is here
            const id = ObjectId(data._id);
            const test = testSchema.cast(data);
            // Error Check to ensure proper format for Mongo ObjectIds
            for (const result in test.results) {
                if (!ObjectId.isValid(result)) {
                    throw new Error('Invalid Result Id')
                }
            }
            const testCaseId = ObjectId(data.testCaseId);
            const result = await client.collection('tests').insertOne({ ...test, _id: id, testCaseId: testCaseId });
            // Push the test plan into the test case array as well
            await client.collection('testCases').updateOne(
                { "_id": testCaseId }, // query matching , refId should be "ObjectId" type
                { $push: { tests: ObjectId(result.insertedId) } } // arr will be array of objects
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
        if (valid && ObjectId.isValid(data.testPlanId)) {
            const testCase = testCaseSchema.cast(data);
            // Error Check to ensure proper format for Mongo ObjectIds
            for (const i in testCase.tests) {
                if (!ObjectId.isValid(testCase.tests[i])) {
                    throw new Error('Invalid Test Id')
                }
            }
            // DYLAN: Mongo will add an _id field to new objects, not sure why this line is here
            const id = ObjectId(data._id);
            const testPlanId = ObjectId(data.testPlanId);

            const result = await client.collection('testCases').insertOne({ ...testCase, _id: id, testPlanId: testPlanId, BOM: [] });
            // Push the test plan into the test case array as well
            const testPlanResult = await client.collection('testPlan').updateOne(
                { "_id": testPlanId }, // query matching , refId should be "ObjectId" type
                { $push: { testCases: result.insertedId } } // arr will be array of objects
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
        if (valid && ObjectId.isValid(data.engagementId)) {
            const testPlan = testPlanSchema.cast(data);
            // DYLAN: Mongo will add an _id field to new objects, not sure why this line is here
            const id = ObjectId(data._id);
            const engagementId = ObjectId(data.engagementId);

            const result = await client.collection('testPlan').insertOne({ ...testPlan, _id: id, engagementId: engagementId, summaryBOM: [] });

            // if this test plan is active, update old test plan to not active and engagement points to new test plan id 
            if (data.isActive) {
                const oldTestPlanId = await client.collection('engagments').findOne({ "_id": engagementId }, { testPlanId: 1 });
                const updateOldResult = await client.collection('testPlan').updateOne(
                    { "_id": oldTestPlanId },
                    { $set: { isActive: false } }
                );

                const engagementResult = await client.collection('engagements').updateOne(
                    { "_id": engagementId },
                    { $set: { testPlanId: result.insertedId } } // update the active test plan id in engagement
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

export async function addEngagement(data) {
    try {
        // Check that data is formatted correctly
        var valid = await engagementSchema.isValid(data);
        var d = await engagementSchema.validate(data);
    } catch (err) {
        return { statusCode: 500, message: "Something went wrong with Yup Validation, check the Schema", info: d, error: err }
    }

    try {
        // Connect to the Database
        var db = await connectToDb();
    } catch (err) {
        return { statusCode: 500, message: "Unable to connect to Mongo Database Server", info: db, error: err }
    }

    // Check that the testPlanId is either an empty string or a Valid Mongo Object Id
    const validObjectIds = ObjectId.isValid(data.testPlanId);
    const emptyTestPlanId = (data.testPlanId === "");
    if (valid && (validObjectIds || emptyTestPlanId)) {
        let engagement = engagementSchema.cast(data);
        if (validObjectIds) {
            // TypeCast ID strings to Mongo ObjectId's
            const testplanId = ObjectId(validData.testPlanId);
            engagement = { ...engagement, testPlanId: testplanId }
        }

        try {
            // Update the Database with new Engagement
            var QueryResult = await client.collection('engagements').insertOne(engagement);
        } catch (err) {
            // Mongo-Side Validation failure should occur here
            return { statusCode: 400, message: "Mongo Database Query was unable to Validate or otherwise Failed", info: QueryResult, error: err }
        }
        // Edit was Successful!
        return { statusCode: 200, message: "Success" }
    }
    else {
        console.log("Valid:", valid);
        console.log("ObjIds:", validObjectIds);
        // Schema is invalid or invalid Ids
        let responseText = "Validation Failed: ";
        if (!valid && !validObjectIds) {
            responseText += "Contains invalid MongoId and Incorrectly formatted data"
        }
        else if (!validObjectIds) {
            responseText += "Contains invalid MongoId"
        }
        else {
            responseText += "Incorrectly formatted data"
        }
        return { statusCode: 422, message: responseText }
    }
}


export async function addBOMDevices(data) {
    try {
        const client = await connectToDb();
        if (ObjectId.isValid(data.testCaseId) & ObjectId.isValid(data.testPlanId)) {
            const testCaseId = ObjectId(data.testCaseId);
            const testPlanId = ObjectId(data.testPlanId);
            // iterate through each item that needs to be added
            for (let i = 0; i < data.devices.length; i++) {
                let device = data.devices[i];
                const valid = await bomDeviceSchema.isValid(device);
                if (valid) {
                    device.deviceId = ObjectId(device.deviceId);
                    device._id = ObjectId(device._id);
                    // Push the new device into BOM of the corresponding test case
                    const result = await client.collection('testCases').updateOne(
                        { "_id": testCaseId },
                        { $push: { BOM: device } }
                    );

                    // Update summaryBOM:  
                    // if deviceId already in summary BOM with same isOptional arguement
                    let summaryBomResult = await client.collection('testPlan').updateOne(
                        { "_id": testPlanId },
                        // update the quantity only if quantity recorded before is less than currently needed 
                        { $set: { "summaryBOM.$[elem].quantity": device.quantity } },
                        {
                            arrayFilters: [{
                                $and: [
                                    { "elem.deviceId": device.deviceId },
                                    { "elem.isOptional": device.isOptional },
                                    // check if quantity recorded before is less than currently needed 
                                    { "elem.quantity": { $lt: device.quantity } }]
                            }
                            ]
                        }
                    );

                    // if such device is not in summaryBOM, insert the device directly
                    if (summaryBomResult.modifiedCount < 1) {
                        console.log("device not in summaryBOM");
                        summaryBomResult = await client.collection('testPlan').updateOne(
                            { "_id": testPlanId },
                            { $push: { summaryBOM: device } }
                        );
                    }


                } else {
                    throw new Error("device not valid ");
                }
            }
            return "success";
        } else {
            throw new Error('Test case id is invalid');
        }
    } catch (err) {
        throw err;
    }
}