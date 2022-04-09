import { editEngagement } from "../../../util/editEntry";
/*
  Edits the requested engagement from the database
*/

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).json({ message: "Only PUT requests allowed" })
  }
  try {
    const response = await editEngagement(req.body);
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(500).json({ message: "Something unexpected occured", errorName: err.name, errorMessage: err.message });
  }
};