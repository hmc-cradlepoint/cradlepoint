import * as yup from 'yup';
const { ObjectId } = require('mongodb');

function objectIdTest(name) {
  return {
    name: name,
    message: (name + " is not a valid ObjectId"),
    test: val => ObjectId.isValid(val)
  }
}

export const testCaseSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id")).optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  config: yup.string().required(),
  topology: yup.string().required(),
  testPlanId: yup.string().test(objectIdTest("testPlanId")).required(),
  tests: yup.array().of(
    yup.string().test(objectIdTest("testId")).required()
  ).required(),
  BOM: yup.array().of(
    yup.object().shape({
      _id: yup.string().test(objectIdTest("BOM[?]._id")).required(),
      deviceId: yup.string().test(objectIdTest("BOM[?].deviceId")).required(),
      isOptional: yup.boolean().required(),
      quantity: yup.number().positive().required(),
    }).required()
  ).required(),
});