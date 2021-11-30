import * as yup from 'yup';

export const engagementSchema = yup.object().shape({
  name: yup.string().required(),
  _id: yup.string().optional(),
  name: yup.string().required(),
  statusCode: yup.number().positive().integer().required(),
  engagementDetails: yup.string().required(),
  SE: yup.string().matches(/^\d+$/),
  POC_Engineer: yup.string().matches(/^\d+$/),
  customer: yup.string().required(),
  SFDC: yup.string().url(),
  BOM: yup.array().required(),
  testPlanId: yup.string().required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }).required(),
});
