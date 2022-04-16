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

export const resultSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id", true)).optional(),
  description: yup.string().required(),
  evidence: yup.string().optional(),
  resultStatus: yup.string().required(),
  testId: yup.string().test(objectIdTest("testId", false)).required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }).required()
});