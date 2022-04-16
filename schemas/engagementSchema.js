import * as yup from 'yup';
const { ObjectId } = require('mongodb');

function objectIdTest(name) {
  return {
    name: name,
    message: (name + " is not a valid ObjectId"),
    test: val => ObjectId.isValid(val)
  }
}

export const engagementSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id")).optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  customer: yup.string().required(),
  SFDC: yup.string().required(),
  SE: yup.string().required(),
  POC_Engineer: yup.string().required(),
  statusCode: yup.number().positive().integer().required(),
  testPlanId: yup.string().test(objectIdTest("testPlanId")).optional(),
  createdOn: yup.date().default(() => new Date()).required(),
});
