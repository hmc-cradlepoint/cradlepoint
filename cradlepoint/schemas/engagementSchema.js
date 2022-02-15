import * as yup from 'yup';

export const engagementSchema = yup.object().shape({
  _id: yup.string().optional(),
  name: yup.string().required(),
  statusCode: yup.number().positive().integer().required(),
  description: yup.string().required(),
  SE: yup.string().matches(/^\d+$/).optional(),
  POC_Engineer: yup.string().matches(/^\d+$/).optional(),
  customer: yup.string().required(),
  SFDC: yup.string().url(),
  testPlanId: yup.string().optional(),
  createdOn: yup.date().default(function () {
    return new Date();
  }).required(),
});
