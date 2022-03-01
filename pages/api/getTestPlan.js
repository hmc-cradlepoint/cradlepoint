const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested test plan from the database
*/
export default async (req, res) => {

  const client = await connectToDb();
  const cursor = client.collection("testPlan").aggregate([
    // Find the test Plan
    { $match: { "_id": ObjectId(req.query._id) } },
    // Separate apart the summaryBOMs
    {
      $unwind: {
          path: '$summaryBOM',
          preserveNullAndEmptyArrays: true
      }
    },
    // Lookup the devices in its table
    {
        $lookup: {
            from: 'device',
            localField: 'summaryBOM.deviceId',
            foreignField: '_id',
            as: 'summaryBOM.device'
        }
    },
    // Change the device from an array into just an object
    {
        $unwind: {
            path: '$summaryBOM.device',
            preserveNullAndEmptyArrays: true
        }
    },
    // Put everything back together
    {
        $group: {
            _id: '$_id',
            devices: {
                $push: '$summaryBOM'
            }
        }
    },
    {
        $lookup: {
            from: 'testPlan',
            localField: '_id',
            foreignField: '_id',
            as: 'testPlanDetails'
        }
    },
    {
        $unwind: {
            path: '$testPlanDetails'
        }
    },
    {
        $addFields: {
            'testPlanDetails.summaryBOM': '$devices'
        }
    },
    {
        $replaceRoot: {
            newRoot: '$testPlanDetails'
        }
    }
]);
  const results = await cursor.toArray();
  res.json(results);
};