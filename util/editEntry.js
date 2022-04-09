import { testSchema } from "../schemas/testSchema";
import { testCaseSchema } from "../schemas/testCaseSchema";
import { testPlanSchema } from "../schemas/testPlanSchema";
import { engagementSchema } from "../schemas/engagementSchema";
import { resultSchema } from "../schemas/resultSchema";
import connectToDb from "./mongodb";
const { ObjectId } = require('mongodb');

export async function editEngagement(data) {
  try {
    // Validate Data
    var validData = await engagementSchema.validate(data, { abortEarly: false });
  } catch (err) {
    return { statusCode: 422, message: "Yup Validation Failed", errors: err.errors }
  }

  try {
    // Connect to the Database
    var db = await connectToDb();
  } catch (err) {
    console.log("Unable to connect to MongoDB")
    return { statusCode: 500, message: "Unable to connect to MongoDB Server", errorName: err.name, error: err.message }
  }

  // Check that all Id strings are Valid Mongo Object Ids
  var validObjectIds = ObjectId.isValid(data.testPlanId) && ObjectId.isValid(data._id);
  if (validObjectIds) {
    // TypeCast ID strings to Mongo ObjectId's
    const id = ObjectId(validData._id);
    const testplanId = ObjectId(validData.testPlanId);
    // Create the database query and replacement object
    const query = { _id: id };
    const newEngagement = { ...validData, _id: id, testPlanId: testplanId };
    try {
      // Update the Database with new Engagement
      var QueryResult = await db.collection("engagements").replaceOne(query, newEngagement);
    } catch (err) {
      // Mongo-Side Validation failures should occur here
      return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", info: QueryResult, errorName: err.name, error: err.message }
    }
    // Edit was Successful!
    return { statusCode: 200, message: "Success" }
  } else {
    // Invalid Ids
    return { statusCode: 422, message: "Validation Failed: Contains invalid MongoId(s)" }
  }
}

export async function editTestPlan(data) {
  try {
    // Validate Data
    var validData = await testPlanSchema.validate(data, { abortEarly: false });
  } catch (err) {
    return { statusCode: 422, message: "Yup Validation Failed", errors: err.errors }
  }

  try {
    // Connect to the Database
    var db = await connectToDb();
  } catch (err) {
    console.log("Unable to connect to MongoDB")
    return { statusCode: 500, message: "Unable to connect to MongoDB Server", errorName: err.name, error: err.message }
  }
  // Check that all Id strings are Valid Mongo Object Ids
  var validDevices = !data.summaryBOM.map((dev) => ObjectId.isValid(dev.deviceId)).includes(false);
  var validTestCases = !data.testCases.map((str) => ObjectId.isValid(str)).includes(false);
  var validObjectIds = validDevices && validTestCases && ObjectId.isValid(data.engagementId) && ObjectId.isValid(data._id);
  if (validObjectIds) {
    // TypeCast ID strings to Mongo ObjectId's
    const id = ObjectId(validData._id);
    const summaryBOM = validData.summaryBOM.map(device => {
      return { ...device, deviceId: ObjectId(device.deviceId) }
    });
    const testCases = validData.testCases.map(testCaseId => ObjectId(testCaseId));
    // Create the database query and replacement object
    const query = { _id: id };
    const newtestPlan = { ...validData, summaryBOM: summaryBOM, testCases: testCases, _id: id };
    try {
      // Update the Database with new TestPlan
      var QueryResult = await db.collection("testPlan").replaceOne(query, newtestPlan);
    } catch (err) {
      // Mongo-Side Validation failure should occur here
      return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", info: QueryResult, errorName: err.name, error: err.message }
    }
    // Edit was Successful!
    return { statusCode: 200, message: "Success" }
  } else {
    // Invalid Ids
    return { statusCode: 422, message: "Validation Failed: Contains invalid MongoId(s)" }
  }
}

export async function editTestCase(data) {
  try {
    // Validate Data
    var validData = await testCaseSchema.validate(data, { abortEarly: false });
  } catch (err) {
    return { statusCode: 422, message: "Yup Validation Failed", errors: err.errors }
  }

  try {
    // Connect to the Database
    var db = await connectToDb();
  } catch (err) {
    console.log("Unable to connect to MongoDB")
    return { statusCode: 500, message: "Unable to connect to MongoDB Server", errorName: err.name, error: err.message }
  }

  // Check that all Id strings are Valid Mongo Object Ids
  var validDevices = !data.BOM.map((dev) => ObjectId.isValid(dev.deviceId)).includes(false);
  var validTests = !data.tests.map((str) => ObjectId.isValid(str)).includes(false);
  var validObjectIds = validDevices && validTests && ObjectId.isValid(data.testPlanId) && ObjectId.isValid(data._id);

  if (validObjectIds) {
    // TypeCast ID strings to Mongo ObjectId's
    const id = ObjectId(validData._id);
    const testPlanId = ObjectId(validData.testPlanId);

    const BOM = validData.BOM.map(device => {
      return { ...device, deviceId: ObjectId(device.deviceId) }
    });
    const tests = validData.tests.map(testId => ObjectId(testId));
    // Create the database query and replacement object
    const query = { _id: id };
    const newTestCase = { ...validData, _id: id, testPlanId: testPlanId, BOM: BOM, tests: tests };
    try {
      // Update the Database with new TestPlan
      var QueryResult = await db.collection("testCases").replaceOne(query, newTestCase);
    } catch (err) {
      // Mongo-Side Validation failure should occur here
      return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", info: QueryResult, errorName: err.name, error: err.message }
    }
    // Edit was Successful!
    return { statusCode: 200, message: "Success" }
  } else {
    // Invalid Ids
    return { statusCode: 422, message: "Validation Failed: Contains invalid MongoId(s)" }
  }
}

export async function editTest(data) {
  try {
    // Validate Data
    var validData = await testSchema.validate(data, { abortEarly: false });
  } catch (err) {
    return { statusCode: 422, message: "Yup Validation Failed", errors: err.errors }
  }

  try {
    // Connect to the Database
    var db = await connectToDb();
  } catch (err) {
    console.log("Unable to connect to MongoDB")
    return { statusCode: 500, message: "Unable to connect to MongoDB Server", errorName: err.name, error: err.message }
  }

  // Check that all Id strings are Valid Mongo Object Ids
  var validResults = !data.results.map((str) => ObjectId.isValid(str)).includes(false);
  var validObjectIds = validResults && ObjectId.isValid(data.testCaseId) && ObjectId.isValid(data._id);

  if (validObjectIds) {
    // TypeCast ID strings to Mongo ObjectId's
    const id = ObjectId(validData._id);
    const testCaseId = ObjectId(validData.testCaseId);
    const results = validData.results.map(resultId => ObjectId(resultId));
    // Create the database query and replacement object
    const query = { _id: id };
    const newTest = { ...validData, _id: id, testCaseId: testCaseId, results: results };
    try {
      // Update the Database with new TestPlan
      var QueryResult = await db.collection("tests").replaceOne(query, newTest);
    } catch (err) {
      // Mongo-Side Validation failure should occur here
      return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", info: QueryResult, errorName: err.name, error: err.message }
    }
    // Edit was Successful!
    return { statusCode: 200, message: "Success" }
  } else {
    // Invalid Ids
    return { statusCode: 422, message: "Validation Failed: Contains invalid MongoId(s)" }
  }
}

export async function editResult(data) {
  try {
    // Validate Data
    var validData = await resultSchema.validate(data, { abortEarly: false });
  } catch (err) {
    return { statusCode: 422, message: "Yup Validation Failed", errors: err.errors }
  }

  try {
    // Connect to the Database
    var db = await connectToDb();
  } catch (err) {
    console.log("Unable to connect to MongoDB")
    return { statusCode: 500, message: "Unable to connect to MongoDB Server", errorName: err.name, error: err.message }
  }

  // Check that all Id strings are Valid Mongo Object Ids
  var validObjectIds = ObjectId.isValid(data.testId) && ObjectId.isValid(data._id);
  if (validObjectIds) {
    // TypeCast ID strings to Mongo ObjectId's
    const id = ObjectId(validData._id);
    const testId = ObjectId(validData.testId);
    // Create the database query and replacement object
    const query = { _id: id };
    const newResult = { ...validData, _id: id, testId: testId };
    try {
      // Update the Database with new TestPlan
      var QueryResult = await db.collection("result").replaceOne(query, newResult);
    } catch (err) {
      // Mongo-Side Validation failure should occur here
      return { statusCode: 400, message: "MongoDB Query Failed or could not Validate", info: QueryResult, errorName: err.name, error: err.message }
    }
    // Edit was Successful!
    return { statusCode: 200, message: "Success" }
  } else {
    // Invalid Ids
    return { statusCode: 422, message: "Validation Failed: Contains invalid MongoId(s)" }
  }
}