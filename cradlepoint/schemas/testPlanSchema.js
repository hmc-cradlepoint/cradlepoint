import * as yup from 'yup';

export const testPlanSchema = yup.object().shape({
  _id: yup.string().optional(),
  name: yup.string().required(),
  detailedDescription: yup.string().required(),
  version: yup.string().required(),
  deviceConfig: yup.string(),
  customerFeedback: yup.string(),
  testCases: yup.array().required(),
  authors: yup.array().required(),
  isActive: yup.bool().required(),
  summaryBOM: yup.array().required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }).required(),
});
