import connectToDb, { clientPromise } from "../../util/mongodb";
/*
 gets all the active engagements from the database
*/
export default async (req, res) => {
  // All status codes greater than 13 are for inactive engagements
  const query = { statusCode: { $lt: 13 } };

  const client = await connectToDb();
  const cursor = client.collection("engagements").find(query);
  const results = await cursor.toArray();
  res.json(results);
};