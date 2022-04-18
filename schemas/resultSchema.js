import * as yup from 'yup';
import { objectIdTest } from './objectIdTest';

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