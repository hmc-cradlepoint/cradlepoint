import * as yup from 'yup';
const { ObjectId } = require('mongodb');

function objectIdTest(name) {
  return {
    name: name,
    message: (name + " is not a valid ObjectId"),
    test: val => ObjectId.isValid(val)
  }
}

export const testSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id")).optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  resultStatus: yup.string().required(),
  testCaseId: yup.string().test(objectIdTest("testCaseId")).required(),
  results: yup.array().of(
    yup.string().test(objectIdTest("resultId")).required()
  ).required()
});
