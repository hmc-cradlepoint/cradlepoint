import connectToDb from "../../util/mongodb";
/*
 gets the test plans from the library
*/
export default async (req, res) => {
  try {
    const client = await connectToDb();
    const cursor = await client.collection("testPlanLibrary").find();
    
    const results = await cursor.toArray();
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }

};

export async function getLibraryTestPlans() {
  try {
    const client = await connectToDb();
    const cursor = await client.collection("testPlanLibrary").find();
    
    const results = await cursor.toArray();
    return JSON.parse(JSON.stringify(results));
  } catch (err) {
    throw err;
  }
};
