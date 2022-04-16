import { testSchema } from "../schemas/testSchema";
import { testCaseSchema } from "../schemas/testCaseSchema";
import { testPlanSchema } from "../schemas/testPlanSchema";
import { engagementSchema } from "../schemas/engagementSchema";
import { resultSchema } from "../schemas/resultSchema";
import { getEngagement } from "../pages/api/getEngagement";
import connectToDb from "./mongodb";
const { ObjectId } = require('mongodb');

export async function editEngagement(data) {
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
    console.log("Unable to connect to MongoDB")
    return { statusCode: 500, message: "Unable to connect to MongoDB Server", errorName: err.name, error: err.message }
  }

  if (validData.hasOwnProperty("_id")) {
    validData._id = ObjectId(validData._id)
  }
  if (validData.hasOwnProperty("testPlanId")) {
    validData.testPlanId = ObjectId(validData.testPlanId)
  }
  const query = { _id: validData._id };
  const newEngagement = validData;
  try {
    // Update the Database with new Engagement
    var queryResult = await db.collection("engagements").replaceOne(query, newEngagement);
  } catch (err) {
    // Mongo-Side Validation failures should occur here
    return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult, errorName: err.name, error: err.message }
  }

  // Edit was Successful!
  return { statusCode: 200, message: "Success", mongoQueryResult: queryResult }
}

export async function editTestPlan(data) {
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

  // Create the database query and replacement object
  const query = { _id: id };
  const newtestPlan = { ...validData };

  try {
    // Update the Database with new TestPlan
    var queryResult = await db.collection("testPlan").replaceOne(query, newtestPlan);
  } catch (err) {
    // Mongo-Side Validation failure should occur here
    return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult, errorName: err.name, error: err.message }
  }
  // Edit was Successful!
  return { statusCode: 200, message: "Success", mongoQueryResult: queryResult }
}

export async function editTestCase(data) {
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
  // TODO: Errorcheck id incase it does not exist
  const id = ObjectId(validData._id);
  const testPlanId = ObjectId(validData.testPlanId);

  const BOM = validData.BOM.map(device => {
    return { ...device, _id: ObjectId(device._id), deviceId: ObjectId(device.deviceId) }
  });
  const tests = validData.tests.map(testId => ObjectId(testId));
  // Create the database query and replacement object
  const query = { _id: id };
  const newTestCase = { ...validData, _id: id, testPlanId: testPlanId, BOM: BOM, tests: tests };
  try {
    // Update the Database with new TestPlan
    var queryResult = await db.collection("testCases").replaceOne(query, newTestCase);
  } catch (err) {
    // Mongo-Side Validation failure should occur here
    return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult, errorName: err.name, error: err.message }
  }
  // Edit was Successful!
  return { statusCode: 200, message: "Success", mongoQueryResult: queryResult }

}

export async function editTest(data) {
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
  // TODO: Errorcheck id incase it does not exist
  const id = ObjectId(validData._id);
  const testCaseId = ObjectId(validData.testCaseId);
  const results = validData.results.map(resultId => ObjectId(resultId));
  // Create the database query and replacement object
  const query = { _id: id };
  const newTest = { ...validData, _id: id, testCaseId: testCaseId, results: results };
  try {
    // Update the Database with new TestPlan
    var queryResult = await db.collection("tests").replaceOne(query, newTest);
  } catch (err) {
    // Mongo-Side Validation failure should occur here
    return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult, errorName: err.name, error: err.message }
  }
  // Edit was Successful!
  return { statusCode: 200, message: "Success", mongoQueryResult: queryResult }
}

export async function editResult(data) {
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
  const id = ObjectId(validData._id);
  // TODO: Errorcheck id incase it does not exist
  const testId = ObjectId(validData.testId);
  // Create the database query and replacement object
  const query = { _id: id };
  const newResult = { ...validData, _id: id, testId: testId };
  try {
    // Update the Database with new TestPlan
    var queryResult = await db.collection("result").replaceOne(query, newResult);
  } catch (err) {
    // Mongo-Side Validation failure should occur here
    return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult, errorName: err.name, error: err.message }
  }
  // Edit was Successful!
  return { statusCode: 200, message: "Success", mongoQueryResult: queryResult }
}

export async function activateTestPlan(data) {
  try {
    // Connect to the Database
    var db = await connectToDb();
  } catch (err) {
    console.log("Unable to connect to MongoDB")
    return { statusCode: 500, message: "Unable to connect to MongoDB Server", errorName: err.name, error: err.message }
  }

  // Get the engagement of the testplan
  try {
    var engagement = await getEngagement(data.engagementId);
    engagement = engagement[0];
  } catch (err) {
    return { statusCode: 500, message: "Something went wrong with getting the engagement", errorName: err.name, error: err.message }
  }

  // Check if the engagement already has an activeTestPlan
  if (engagement.hasOwnProperty('testPlanId')) {
    // Set the previous activeTestPlan's isActive field to false
    try {
      var queryResult_1 = await db.collection('testPlan').updateOne({ "_id": ObjectId(engagement.testPlanId) },
        { $set: { "isActive": false } });
    } catch (err) {
      return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult_1, errorName: err.name, error: err.message };
    }
  }
  // Set the new activeTestPlan's isActive field to true
  try {
    var queryResult_2 = await db.collection('testPlan').updateOne({ "_id": ObjectId(data.testPlanId) },
      { $set: { "isActive": true } });
  } catch (err) {
    return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult_2, errorName: err.name, error: err.message };
  }

  // Update the active test plan of the engagement
  try {
    var queryResult_3 = await db.collection('engagements').updateOne(
      { "_id": ObjectId(data.engagementId) },
      { $set: { testPlanId: ObjectId(data.testPlanId) } }
    );
  } catch (err) {
    return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", mongoQueryResult: queryResult_3, errorName: err.name, error: err.message };
  }

  // TestPlan Activation was Successful!
  return { statusCode: 200, message: "Success", firstQueryResult: queryResult_1, secondQueryResult: queryResult_2, thirdQueryResult: queryResult_3 };
}