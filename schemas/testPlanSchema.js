import * as yup from 'yup';
const { ObjectId } = require('mongodb');

function objectIdTest(name, isOptional) {
  return (isOptional ? {
    name: name,
    message: (name + " is not a valid ObjectId"),
    test: val => val === undefined || ObjectId.isValid(val)
  } : {
    name: name,
    message: (name + " is not a valid ObjectId"),
    test: val => ObjectId.isValid(val)
  })
}

export const testPlanSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id", true)).optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  customerFeedback: yup.string().required(),
  authors: yup.array().optional(),
  version: yup.string().required(),
  isActive: yup.bool().required(),
  deviceConfig: yup.string().optional(),
  engagementId: yup.string().test(objectIdTest("engagementId", false)).required(),
  testCases: yup.array().of(
    yup.string().test(objectIdTest("testCaseId", false)).required()
  ).required(),
  summaryBOM: yup.array().of(
    yup.object().shape({
      _id: yup.string().test(objectIdTest("summaryBOM[?]._id", false)).required(),
      deviceId: yup.string().test(objectIdTest("summaryBOM[?]._deviceId", false)).required(),
      isOptional: yup.boolean().required(),
      quantity: yup.number().positive().required(),
    }).required()
  ).required(),  
  createdOn: yup.date().default(function () {
    return new Date();
  }).required(),
});
