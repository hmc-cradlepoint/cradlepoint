import { editTestCase } from "../../../util/editEntry";
/*
  Edits the requested TestCase from the database
*/

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).send({ message: 'Only PUT requests allowed' })
  }
  try {
    const response = await editTestCase(req.body);
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(500).json({ message: "Something unexpected occured", errorName: err.name, errorMessage: err.message });
  }
};