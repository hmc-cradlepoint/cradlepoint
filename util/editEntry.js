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
    const valid = await engagementSchema.isValid(data);
    // Check that all Id strings are Valid Mongo Object Ids
    const validObjectIds = ObjectId.isValid(data.testPlanId) && ObjectId.isValid(data._id);
  } catch (err) {
    return { statusCode: 422, message: "Validation Failed: See Yup Schema", info: valid, error: err }
  }
  if (valid && validObjectIds) {
    const validData = engagementSchema.cast(data);
    // Set ID strings to Mongo ObjectId's
    const id = ObjectId(validData._id);
    const testplanId = ObjectId(validData.testPlanId);
    // Create the database query and replacement object
    const query = { _id: id };
    const newEngagement = { ...validData, _id: id, testPlanId: testplanId };
    try {
      // Connect to the Database
      const db = await connectToDb();
    } catch (err) {
      return { statusCode: 500, message: "Unable to connect to Mongo Database Server", info: db, error: err }
    }
    try {
      // Update the Database w/ new Engagement
      const QueryResult = await db.collection("engagements").replaceOne(query, newEngagement);
    } catch (err) {
      return { statusCode: 400, message: "Mongo Database Query was unable to Validate or Failed", info: QueryResult, error: err }
    }
    // Success!
    return { statusCode: 200, message: "Success" }
  } else {
    // Scema is valid, but contains incorrect ObjectIds
    return { statusCode: 422, message: "Validation Failed: Contains invalid MongoId" }
  }
}