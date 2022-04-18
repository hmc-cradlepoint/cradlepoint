import * as yup from 'yup';
import { objectIdTest } from './objectIdTest';

export const engagementSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id", true)).optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  customer: yup.string().required(),
  SFDC: yup.string().required(),
  SE: yup.string().required(),
  POC_Engineer: yup.string().required(),
  statusCode: yup.number().positive().integer().required(),
  testPlanId: yup.string().test(objectIdTest("testPlanId", true)).optional(),
  createdOn: yup.date().default(() => new Date()).required(),
});
