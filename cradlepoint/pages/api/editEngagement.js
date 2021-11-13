const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested test plan from the database
*/
export default async (req, res) => {
  const query = { '_id': ObjectId("617249b199915be1b771aca1") };
  const updates = {
    '_id': ObjectId("617249b199915be1b771aca1"), 
    'statusCode': 2,
    'engagementDetails': 'Test Details 2',
    'SE': '1234',
    'POC_Engineer': '2345',
    'customer': 'Big Finance',
    'SFDC': '"https://cradlepoint.lightning.force.com/lightning/r/Opportunity/006380..."',
    'testPlanId': ObjectId("61724e5599915be1b771acb2"),
    'BOM': [""],
    'createdOn': new Date(2021, 10, 20, 7, 0, 0, 0)
  }; 
  try {
    await engagementSchema.isValid(req.body).then(async function (valid) {
      if (valid){
        const engagement = engagementSchema.cast(updates);
        const db = await connectToDb();
        await db.collection("engagements").replaceOne(query, engagement);
        const results = await db.collection("engagements").find(query).toArray();
        res.json(results);
        //res.status(200).send({message: result});
      }
      else {
        res.status(422).send({message: 'Input not in right format'})
      }
    })
  } catch (err) {
    res.status(500).send(err);
  }

};