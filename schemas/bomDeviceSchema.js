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

export const bomDeviceSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id", false)).required(),
  deviceId: yup.string().test(objectIdTest("deviceId", false)).required(),
  quantity: yup.number().positive().required(),
  isOptional: yup.boolean().required(),
});