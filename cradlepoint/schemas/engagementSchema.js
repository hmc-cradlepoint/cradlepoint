import * as yup from 'yup';
const { ObjectId } = require('bson');

export const engagementSchema = yup.object().shape({
  statusCode: yup.number().positive().integer().required(),
  engagementDetails: yup.string().required(),
  SE: yup.string().matches(/^\d+$/),
  POC_Engineer: yup.string().matches(/^\d+$/),
  customer: yup.string().required(),
  SFDC: yup.string().url(),
  BOM: yup.array().required(),
  testplanID: yup.string().required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }).required(),
});
