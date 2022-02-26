import * as yup from 'yup';

export const testCaseSchema = yup.object().shape({
  _id: yup.string().optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  config: yup.string().required(),
  topology: yup.string().required(),
  timeEstimate: yup.number().positive().required(),
  testPlanId: yup.string().required(),
  tests: yup.array().of(
    yup.string().required()
  ).required(),
  BOM: yup.array().of(
    yup.object().shape({
      isOptional: yup.boolean().required(),
      quantity: yup.number().positive().required(),
      deviceId: yup.string().required(),
    })
  ).required(),
});