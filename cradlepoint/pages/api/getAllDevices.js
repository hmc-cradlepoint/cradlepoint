const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
/*
  Gets the requested device from the database
*/
export default async (req, res) => {

  try {
    const client = await connectToDb();
    const cursor = client.collection("device").find();
    const results = await cursor.toArray();
    res.json(results);
  } catch (err) {
    res.status(500).send(err)
  }

};