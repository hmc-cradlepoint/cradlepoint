const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets export data for an engagement by ID
  Expand every entity (test plan, test case, test)
*/
export default async (req, res) => {

  const query = { 'engagementId': ObjectId(req.query.engagementId),
                  'isActive': true };

  const client = await connectToDb();
  const cursor = client.collection("engagements").aggregate([
    { $match: { "_id": ObjectId(req.query._id) } }, 
    // look up what the status code represent
    { $lookup:
      {
        from: 'statusCodes',
        localField: 'statusCode',
        foreignField: '_id',
        as: 'status'
      }
    },
    {
      $set: {
        status: { $arrayElemAt: ["$status.status", 0] }
      }
    },
    { $lookup:
      {
        from: 'testPlan',
        localField: 'testPlanId',
        foreignField: '_id',
        as: 'activeTestPlan'
      }
    },
    {
      $unwind: "$activeTestPlan"
    },
    { $lookup:
      {
        from: 'testCases',
        localField: 'activeTestPlan.testCases',
        foreignField: '_id',
        as: 'activeTestPlan.testCases'
      }
    },
    {
      $unwind: "$activeTestPlan.testCases"
    },
    { $lookup:
      {
        from: 'tests',
        localField: 'activeTestPlan.testCases.tests',
        foreignField: '_id',
        as: 'activeTestPlan.testCases.tests'
      }
    },
    // filter out the fields we don't want to display
    { $project: {"_testPlanId":0, "statusCode":0, "activeTestPlan.engagementId":0,
                "activeTestPlan.summaryBOM.deviceId":0, "activeTestPlan.isActive": 0,
                "activeTestPlan.authors": 0, "activeTestPlan.testCases.testPlanId":0,
                "activeTestPlan.testCases.BOM":0, "activeTestPlan.testCases.tests.testCaseId":0,
                }}
  ]);
  const results = await cursor.toArray();
  res.json(results);
};