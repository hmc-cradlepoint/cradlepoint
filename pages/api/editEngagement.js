const { ObjectId } = require('mongodb');
import connectToDb from "../../util/mongodb";
import { engagementSchema } from "../../schemas/engagementSchema";
import { editEngagement } from "../../util/editEntry";
/*
  Edits the requested engagement from the database
*/

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).send({ message: "Only PUT requests allowed" })
  }
  try {
    const response = await editEngagement(req.body);
    console.log("TEST");
    switch (response.statusCode) {
      case 200:
        res.status(200).send(response);
      case 400:
        res.status(400).send(response);
      case 422:
        res.status(422).send(response);
      case 500:
        res.status(500).send(response);
    }
  } catch (err) {
    console.log("ERROR", err);
    res.status(500).send({ message: "Something Unexpected Occured", error: err });
  }
};