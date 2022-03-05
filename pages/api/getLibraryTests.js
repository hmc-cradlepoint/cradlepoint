import connectToDb from "../../util/mongodb";
/*
 gets the test plans from the library
*/
export default async (req, res) => {
  try {
    const client = await connectToDb();
    const cursor = await client.collection("testLibrary").find();
    
    const results = await cursor.toArray();
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }

};