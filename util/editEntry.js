import { testSchema } from "../schemas/testSchema";
import { testCaseSchema } from "../schemas/testCaseSchema";
import { testPlanSchema } from "../schemas/testPlanSchema";
import { engagementSchema } from "../schemas/engagementSchema";
import connectToDb from "./mongodb";
import { resultSchema } from "../schemas/resultSchema";
const { ObjectId } = require('mongodb');


export async function editEngagement(data) {
  try {
    // Check that data is formatted correctly
    var valid = await engagementSchema.isValid(data);
    // Check that all Id strings are Valid Mongo Object Ids
    var validObjectIds = ObjectId.isValid(data.testPlanId) && ObjectId.isValid(data._id);
  } catch (err) {
    return { statusCode: 500, message: "Something went wrong with Yup Validation, check the Schema", info: valid, error: err }
  }
  if (valid && validObjectIds) {
    const validData = engagementSchema.cast(data);
    // TypeCast ID strings to Mongo ObjectId's
    const id = ObjectId(validData._id);
    const testplanId = ObjectId(validData.testPlanId);
    // Create the database query and replacement object
    const query = { _id: id };
    const newEngagement = { ...validData, _id: id, testPlanId: testplanId };
    try {
      // Connect to the Database
      var db = await connectToDb();
    } catch (err) {
      return { statusCode: 500, message: "Unable to connect to Mongo Database Server", info: db, error: err }
    }
    try {
      // Update the Database with new Engagement
      var QueryResult = await db.collection("engagements").replaceOne(query, newEngagement);
    } catch (err) {
      // Mongo-Side Validation failure should occur here
      return { statusCode: 400, message: "Mongo Database Query was unable to Validate or otherwise Failed", info: QueryResult, error: err }
    }
    // Edit was Successful!
    return { statusCode: 200, message: "Success" }
  } else {
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