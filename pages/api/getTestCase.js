const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested test case from the database
*/
export default async (req, res) => {

  const client = await connectToDb();
  const cursor = client.collection("testCases").aggregate([
    // Find the test case
    { $match: { "_id": ObjectId(req.query._id) } },
    {
        $unwind: {
            path: '$BOM',
            preserveNullAndEmptyArrays: true
        }
    },
    // Separate apart the BOM
    // Lookup the devices in its table
    {
        $lookup: {
            from: 'device',
            localField: 'BOM.deviceId',
            foreignField: '_id',
            as: 'BOM.device'
        }
    },
    // Change the device from an array into just an object
    {
        $unwind: {
            path: '$BOM.device',
            preserveNullAndEmptyArrays: true
        }
    },
    // Put everything back together
    {
        $group: {
            _id: '$_id',
            devices: {
                $push: '$BOM'
            }
        }
    },
    {
        $lookup: {
            from: 'testCases',
            localField: '_id',
            foreignField: '_id',
            as: 'testCaseDetails'
        }
    },
    {
        $unwind: {
            path: '$testCaseDetails'
        }
    },
    {
        $addFields: {
            'testCaseDetails.BOM': '$devices'
        }
    },
    {
        $replaceRoot: {
            newRoot: '$testCaseDetails'
        }
    }
  ]);
  const results = await cursor.toArray();
  res.json(results);
};

export async function getTestCase(_id) {

    const client = await connectToDb();
    const cursor = client.collection("testCases").aggregate([
      // Find the test case
      { $match: { "_id": ObjectId(_id) } },
      {
          $unwind: {
              path: '$BOM',
              preserveNullAndEmptyArrays: true
          }
      },
      // Separate apart the summaryBOMs
      // Lookup the devices in its table
      {
          $lookup: {
              from: 'device',
              localField: 'BOM.deviceId',
              foreignField: '_id',
              as: 'BOM.device'
          }
      },
      // Change the device from an array into just an object
      {
          $unwind: {
              path: '$BOM.device',
              preserveNullAndEmptyArrays: true
          }
      },
      // Put everything back together
      {
          $group: {
              _id: '$_id',
              devices: {
                  $push: '$BOM'
              }
          }
      },
      {
          $lookup: {
              from: 'testCases',
              localField: '_id',
              foreignField: '_id',
              as: 'testCaseDetails'
          }
      },
      {
          $unwind: {
              path: '$testCaseDetails'
          }
      },
      {
          $addFields: {
              'testCaseDetails.BOM': '$devices'
          }
      },
      {
          $replaceRoot: {
              newRoot: '$testCaseDetails'
          }
      }
    ]);
    const results = await cursor.toArray();
    return JSON.parse(JSON.stringify(results));
  };