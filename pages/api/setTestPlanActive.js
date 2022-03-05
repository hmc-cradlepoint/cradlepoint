const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Make a test plan of an Engagement active and inactivate the old test plan if there is one
*/

export default async (req, res) => {
  try{
    const client = await connectToDb();
    const data = req.body;
    const engagementId = data.engagementId;
    const newTestPlanId = ObjectId(data.testPlanId);
  
    // inactivate the old test plan of the engagement
    const engagement = await (await fetch(`${process.env.HOST}/api/getEngagement?_id=${engagementId}`)).json();
    // check if an engagement can be found
    if (engagement.length>0){
        const oldTestPlanId = ObjectId(engagement[0].testPlanId);
        await client.collection('testPlan').updateOne({ "_id": ObjectId(oldTestPlanId)}, 
                                                    { $set: { "isActive": false}});
    }
    // set the new test plan isActive field to true
    const result = await client.collection('testPlan').updateOne({ "_id": newTestPlanId}, 
                                                    { $set: { "isActive": true}});
       
    // Update the active test plan of the engagement to the current one
    await client.collection('engagements').updateOne(
      { "_id": ObjectId(engagementId) }, 
      { $set: { testPlanId: newTestPlanId}} 
      );

    res.status(200).send({message: "Success!"});
    return result;
  } catch (err) {
    res.status(500).send(err);
  }
};