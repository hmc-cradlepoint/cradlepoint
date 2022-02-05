import * as yup from 'yup';

export const testSchema = yup.object().shape({
  _id: yup.string().optional(),
  description: yup.string().required(),
  name: yup.string().required(),
  results: yup.array().of(
    yup.string().required()
  ).required(),
  testCaseId: yup.string().required(),
  resultStatus: yup.string().optional()
});
