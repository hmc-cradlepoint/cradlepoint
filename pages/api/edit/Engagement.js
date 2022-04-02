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
    switch (response.statusCode) {
      case 200:
        res.status(200).json(response);
        break;
      case 400:
        res.status(400).json(response);
        break;
      case 422:
        res.status(422).json(response);
        break;
      case 500:
        res.status(500).json(response);
    }
  } catch (err) {
    res.status(500).json({ message: "Something Unexpected Occured", error: err });
  }
};