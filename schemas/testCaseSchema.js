import * as yup from 'yup';
import { objectIdTest } from './objectIdTest';

export const testCaseSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id", true)).optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  config: yup.string().required(),
  topology: yup.string().required(),
  testPlanId: yup.string().test(objectIdTest("testPlanId", false)).required(),
  tests: yup.array().of(
    yup.string().test(objectIdTest("testId", false)).required()
  ).required(),
  BOM: yup.array().of(
    yup.object().shape({
      _id: yup.string().test(objectIdTest("BOM[?]._id", false)).required(),
      deviceId: yup.string().test(objectIdTest("BOM[?].deviceId", false)).required(),
      isOptional: yup.boolean().required(),
      quantity: yup.number().positive().required(),
    }).required()
  ).required(),
});