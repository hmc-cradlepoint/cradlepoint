import * as yup from 'yup';

export const testPlanSchema = yup.object().shape({
  _id: yup.string().optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  customerFeedback: yup.string().required(),
  authors: yup.array().optional(),
  version: yup.string().required(),
  isActive: yup.bool().required(),
  deviceConfig: yup.string().optional(),
  engagementId: yup.string().required(),
  testCases: yup.array().of(
    yup.string().optional()
  ).required(),
  summaryBOM: yup.array().of(
    yup.object().shape({
      isOptional: yup.boolean().required(),
      quantity: yup.number().positive().required(),
      deviceId: yup.string().required(),
    }).optional()
  ).required(),  
  createdOn: yup.date().default(function () {
    return new Date();
  }).required(),
});
