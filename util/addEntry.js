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
        // Validate Data
        var validData = await testCaseSchema.validate(data, { abortEarly: false, stripUnknown: true });
    } catch (err) {
        return { statusCode: 422, message: "Yup Validation Failed", errorName: err.name, error: err.message, errors: err.errors }
    }

    try {
        // Connect to the Database
        var db = await connectToDb();
    } catch (err) {
        console.log("Unable to connect to MongoDB")
        return { statusCode: 500, message: "Unable to connect to MongoDB Server", errorName: err.name, error: err.message }
    }

    // TypeCast ID strings to Mongo ObjectId's
    if (validData.hasOwnProperty("_id")) {
        validData._id = ObjectId(validData._id);
    }
    validData.testPlanId = ObjectId(validData.testPlanId);
    validData.BOM = validData.BOM.map(device => {
        return { ...device, _id: ObjectId(device._id), deviceId: ObjectId(device.deviceId) }
    });
    validData.tests = validData.tests.map(testId => ObjectId(testId));

    try {
        // Update the Database with new TestPlan
        var queryResult = await db.collection('testCases').insertOne({ ...validData, BOM: [] });
    } catch (err) {
        // Mongo-Side Validation failure should occur here
        return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult, errorName: err.name, error: err.message }
    }

    try {
        // Push the test plan into the test case array as well
        var testPlanUpdateResult = await db.collection('testPlan').updateOne(
            { "_id": validData.testPlanId }, // query matching , refId should be "ObjectId" type
            { $push: { testCases: queryResult.insertedId } } // arr will be array of objects
        );
        if (testPlanUpdateResult.modifiedCount != 1) {
            throw new Error('TestCase was added successfully, but testPlan.testCases was not updated')
        }
    } catch(err) {
        return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", testPlanUpdateResult: testPlanUpdateResult, errorName: err.name, error: err.message }
    }
    // Edit was Successful!
    return { statusCode: 200, message: "Success", mongoQueryResult: queryResult, testPlanUpdateResult: testPlanUpdateResult}
}

export async function addTestPlan(data) {
    try {
        // Validate Data
        var validData = await testPlanSchema.validate(data, { abortEarly: false, stripUnknown: true });
    } catch (err) {
        return { statusCode: 422, message: "Yup Validation Failed", errorName: err.name, error: err.message, errors: err.errors }
    }

    try {
        // Connect to the Database
        var db = await connectToDb();
    } catch (err) {
        console.log("Unable to connect to MongoDB")
        return { statusCode: 500, message: "Unable to connect to MongoDB Server", errorName: err.name, error: err.message }
    }

    // TypeCast ID strings to Mongo ObjectId's
    if (validData.hasOwnProperty("_id")) {
        validData._id = ObjectId(validData._id)
    }
    validData.engagementId = ObjectId(validData.engagementId);
    validData.summaryBOM = validData.summaryBOM.map(device => {
        return { ...device, _id: ObjectId(device._id), deviceId: ObjectId(device.deviceId) }
    });
    validData.testCases = validData.testCases.map(testCaseId => ObjectId(testCaseId));

    // TODO: add proper checks so that adding can set isActive and summaryBOM
    try {
        // Update the Database with new TestPlan
        var queryResult = await db.collection('testPlan').insertOne({ ...validData, isActive: false, summaryBOM: [] });
    } catch (err) {
        // Mongo-Side Validation failure should occur here
        return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult, errorName: err.name, error: err.message }
    }
    // Add was Successful!
    return { statusCode: 200, message: "Success", mongoQueryResult: queryResult }

}

export async function addEngagement(data) {
    try {
        // Validate Data
        var validData = await engagementSchema.validate(data, { abortEarly: false, stripUnknown: true });
    } catch (err) {
        return { statusCode: 422, message: "Yup Validation Failed", errorName: err.name, error: err.message, errors: err.errors }
    }

    try {
        // Connect to the Database
        var db = await connectToDb();
    } catch (err) {
        console.log("Unable to connect to MongoDB");
        return { statusCode: 500, message: "Unable to connect to MongoDB Server", errorName: err.name, error: err.message }
    }

    // TypeCast ID strings to Mongo ObjectId's
    if (validData.hasOwnProperty("_id")) {
        validData._id = ObjectId(validData._id)
    }
    if (validData.hasOwnProperty("testPlanId")) {
        validData.testPlanId = ObjectId(validData.testPlanId);
    }

    try {
        // Update the Database with new Engagement
        var queryResult = await db.collection('engagements').insertOne(validData);
    } catch (err) {
        // Mongo-Side Validation failure should occur here
        return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult, errorName: err.name, error: err.message }
    }
    // Add was Successful!
    return { statusCode: 200, message: "Success", mongoQueryResult: queryResult }

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
                    console.log(result)


                    // if deviceId already in summary BOM with same isOptional arguement, update quantity
                    const updateResult = await client.collection('testPlan').updateOne(
                        { "_id": testPlanId, "summaryBOM": { $elemMatch: { deviceId: device.deviceId, isOptional: device.isOptional } } },
                        // update the quantity only if quantity recorded before is less than currently needed 
                        { $max: { "summaryBOM.$[elem].quantity": device.quantity } },
                        {
                            arrayFilters: [{
                                $and: [
                                    { "elem.deviceId": device.deviceId },
                                    { "elem.isOptional": device.isOptional }
                                ]
                            }
                            ]
                        }
                    );
                    console.log(updateResult);

                    // if such device is not in summaryBOM, insert the device directly
                    if (updateResult.matchedCount < 1) {
                        console.log("device not in summaryBOM");
                        let summaryBomResult = await client.collection('testPlan').updateOne(
                            { "_id": testPlanId },
                            { $push: { summaryBOM: device } }
                        );
                        console.log(summaryBomResult);
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