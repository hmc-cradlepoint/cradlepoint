import * as yup from 'yup';

export const engagementSchema = yup.object().shape({
  _id: yup.string().optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  customer: yup.string().required(),
  SFDC: yup.string().required(),
  SE: yup.string().required(),
  POC_Engineer: yup.string().required(),
  statusCode: yup.number().positive().integer().required(),
  testPlanId: yup.string().optional(),
  createdOn: yup.date().default(() => new Date()).required(),
});
