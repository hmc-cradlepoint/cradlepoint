import { deleteTestCase } from "../../util/deleteEntry";

export default async function handler(req, res) {
    console.log(req?.body)
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
    }
    try {
        console.log(req.body);
        const response = await deleteTestCase(req.body);
        res.status(200).send({message: response});
    } catch (err) {
        res.status(500).send(err.message);
    }
  }
