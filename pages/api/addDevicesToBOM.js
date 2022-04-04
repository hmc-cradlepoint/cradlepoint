import { addDevicesToBOM } from "../../util/addEntry";

export default async function handler(req, res) {
  console.log(req.method, req.body);
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
  }
  else{
      try {
        const response = await addDevicesToBOM(req.body)
        res.status(200).send({message: response});
      } catch (err) {
        res.status(500).send(err.message);
      }
  }
  }