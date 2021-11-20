import * as yup from 'yup';

export const testCaseSchema = yup.object().shape({
  timeEstimate: yup.number().positive().required(),
  description: yup.string().required(),
  config: yup.string().required(),
  name: yup.string().required(),
  tests: yup.array().required(),
  BOM: yup.array().required(),
  testPlanId: yup.string().required(),
});