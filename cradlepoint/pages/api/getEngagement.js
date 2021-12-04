import connectToDb from "../../util/mongodb";
const { ObjectId } = require('mongodb');

/*
 gets all the active engagements from the database
*/
export default async (req, res) => {
  if ( ObjectId.isValid(req.query._id) ) {
    const query = { "_id": ObjectId(req.query._id) };

    const client = await connectToDb();
    const cursor = await client.collection("engagements").aggregate([
        { $match: { "_id": ObjectId(req.query._id) } },
        { $lookup:
            {
              from: 'user',
              localField: 'POC_Engineer',
              foreignField: 'userId',
              as: 'POC_Eningeer_details'
            }
        },
        { $lookup:
            {
              from: 'user',
              localField: 'SE',
              foreignField: 'userId',
              as: 'SEDetails'
            }
        }
    ]);

    const results = await cursor.toArray();
    res.json(results);
  }
  else {
    res.status(422).send({message: 'Invalid ID format'})
  }
  
};