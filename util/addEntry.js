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
        // Validate Data
        var validData = await resultSchema.validate(data, { abortEarly: false, stripUnknown: true });
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
    validData.testId = ObjectId(validData.testId);

    try {
        // Update the Database with new TestPlan
        var queryResult = await db.collection('result').insertOne(validData);
      } catch (err) {
        // Mongo-Side Validation failure should occur here
        return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult, errorName: err.name, error: err.message }
    }

    try {
        // Update parent Test's references to its children
        // Update parent Test with most recent result's status
        var testUpdateResult = await db.collection('tests').updateOne(
            { "_id": validData.testId },
            { $set: { resultStatus: validData.resultStatus }, $push: { results: queryResult.insertedId } }
        );
        if (testUpdateResult.modifiedCount != 1) {
            throw new Error('Result was added successfully, but test.results and test.resultStatus was not updated')
        }
    } catch(err) {
        return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", testUpdateResult: testUpdateResult, errorName: err.name, error: err.message }
    }
    // Add was Successful!
    return { statusCode: 200, message: "Success", mongoQueryResult: queryResult, testUpdateResult: testUpdateResult}
}

export async function addTest(data) {
    try {
        // Validate Data
        var validData = await testSchema.validate(data, { abortEarly: false, stripUnknown: true });
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
    validData.testCaseId = ObjectId(validData.testCaseId);
    validData.results = validData.results.map(resultId => ObjectId(resultId));

    try {
        // Update the Database with new TestPlan
        var queryResult = await db.collection('tests').insertOne(validData);
      } catch (err) {
        // Mongo-Side Validation failure should occur here
        return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult, errorName: err.name, error: err.message }
    }

    try {
        // Update parent TestCase's references to its children
        var testCaseUpdateResult = await db.collection('testCases').updateOne(
            { "_id": validData.testCaseId },
            { $push: { tests: ObjectId(queryResult.insertedId) } }
        );
        if (testCaseUpdateResult.modifiedCount != 1) {
            throw new Error('Test was added successfully, but testCase.tests was not updated')
        }
    } catch(err) {
        return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", testCaseUpdateResult: testCaseUpdateResult, errorName: err.name, error: err.message }
    }
    // Add was Successful!
    return { statusCode: 200, message: "Success", mongoQueryResult: queryResult, testCaseUpdateResult: testCaseUpdateResult}

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
        // Update parent TestPlan's references to its children
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
    // Add was Successful!
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
            const summaryBOM = (await client.collection('testPlan').findOne({"_id": testPlanId })).summaryBOM;
        
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
                    
                    // Update summaryBOM:  
                    // get the device in summaryBOM corresponding to this device in the test case
                    let summaryBomDevice = summaryBOM.filter(d => (d.isOptional === device.isOptional) && d.deviceId.equals(device.deviceId));      
                    console.log(summaryBomDevice)
                     // if deviceId already in summary BOM with same isOptional arguement
                    if (summaryBomDevice.length>0){
                        summaryBomDevice = summaryBomDevice[0];
                        // check if quantity recorded before is less than currently needed 
                        if(summaryBomDevice.quantity<device.quantity){
        
                            let summaryBomResult = await client.collection('testPlan').updateOne(
                                {"_id": testPlanId}, 
                                {$set: {"summaryBOM.$[element].quantity": device.quantity}},
                                {arrayFilters: [{"element._id" :   summaryBomDevice._id}] 
                                }
                            ); 
                            console.log(summaryBomResult);
                        }
                        
                        
                        
                    } else{
                        // if such device is not in summaryBOM, insert the device directly
                        console.log("device not in summaryBOM");
                        summaryBomResult = await client.collection('testPlan').updateOne(
                            { "_id": testPlanId }, 
                            { $push: { summaryBOM: device}} 
                        );
                        console.log("added to summaryBOM", summaryBomResult);
                    }

                } else{
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