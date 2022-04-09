import connectToDb from "../../util/mongodb";
import { resultColumns } from "../../util/tableColumns";
/*
 gets all the active engagements from the database
*/
export default async (req, res) => {
  // All status codes greater than 13 are for inactive engagements
  const query = { statusCode: { $lt: 13 } };

  const client = await connectToDb();
  const cursor = await client.collection("engagements").find(query);
  
  const results = await cursor.toArray();
  res.json(results);
};

export async function getActiveEngagements() {
  // All status codes greater than 13 are for inactive engagements
  const query = { statusCode: { $lt: 13 } };

  const client = await connectToDb();
  const cursor = await client.collection("engagements").find(query);
  
  const results = await cursor.toArray();

  // TODO: Possibly find a better way to do this
  return JSON.parse(JSON.stringify(results));
}