import * as yup from 'yup';
const { ObjectId } = require('mongodb');

function objectIdTest(name) {
  return {
    name: name,
    message: (name + " is not a valid ObjectId"),
    test: val => ObjectId.isValid(val)
  }
}

export const testPlanSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id")).optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  customerFeedback: yup.string().required(),
  authors: yup.array().optional(),
  version: yup.string().required(),
  isActive: yup.bool().required(),
  deviceConfig: yup.string().optional(),
  engagementId: yup.string().test(objectIdTest("engagementId")).required(),
  testCases: yup.array().of(
    yup.string().test(objectIdTest("testCaseId")).optional()
  ).required(),
  summaryBOM: yup.array().of(
    yup.object().shape({
      _id: yup.string().test(objectIdTest("summaryBOM[?]._id")).required(),
      deviceId: yup.string().test(objectIdTest("summaryBOM[?]._deviceId")).required(),
      isOptional: yup.boolean().required(),
      quantity: yup.number().positive().required(),
    }).required()
  ).required(),  
  createdOn: yup.date().default(function () {
    return new Date();
  }).required(),
});
