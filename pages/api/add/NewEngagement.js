import { addEngagement } from "../../../util/addEntry"
/*
  Adds the supplied Engagement to the database
*/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
  }
  else {
    try {
      const response = await addEngagement(req.body)
      res.status(response.statusCode).json(response);
    } catch (err) {
      res.status(500).json({ message: "Something Unexpected Occured", errorName: err.name, errorMessage: err.message });
    }
  }
}