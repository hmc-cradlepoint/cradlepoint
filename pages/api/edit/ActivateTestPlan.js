import { activateTestPlan } from "../../../util/editEntry";
/*
  Activates a new activeTestplan for an engagement, deactivates the previous activeTestPlan
*/

export default async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).json({ message: "Only PUT requests allowed" })
  }
  try {
    const response = await activateTestPlan(req.body);
    res.status(response.statusCode).json(response);
  } catch (err) {
    res.status(500).json({ message: "Something unexpected occured", errorName: err.name, errorMessage: err.message });
  }
};