import * as yup from 'yup';
const { ObjectId } = require('mongodb');

function objectIdTest(name) {
  return {
    name: name,
    message: (name + " is not a valid ObjectId"),
    test: val => ObjectId.isValid(val)
  }
}

export const libraryDeviceSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id")).optional(),
  deviceName: yup.string().required(),
  codeVersion: yup.string().required(),
  SKU: yup.string().required(),
  deviceType: yup.string().required(),
});