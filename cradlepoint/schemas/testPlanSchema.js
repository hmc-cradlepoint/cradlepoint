import * as yup from 'yup';

export const testPlanSchema = yup.object().shape({
  _id: yup.string().optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  customerFeedback: yup.string().optional(),
  authors: yup.array().required(),
  version: yup.string().required(),
  isActive: yup.bool().required(),
  deviceConfig: yup.string().optional(),
  engagementId: yup.string().required(),
  testCases: yup.array().of(
    yup.string().required()
  ).required(),
  summaryBOM: yup.array().of(
    yup.object().shape({
      isOptional: yup.boolean().required(),
      quantity: yup.number().positive().required(),
      deviceId: yup.string().required(),
    })
  ).required(),  
  createdOn: yup.date().default(function () {
    return new Date();
  }).required(),
});
