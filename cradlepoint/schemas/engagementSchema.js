import * as yup from 'yup';

export const engagementSchema = yup.object().shape({
  statusCode: yup.number().positive().integer().required(),
  engagementDetails: yup.string().required(),
  SE: yup.number().positive().integer(),
  POC_Engineer: yup.number().positive().integer(),
  customer: yup.string().required(),
  SFDC: yup.string().url(),
  BOM: yup.array().required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }).required(),
});
