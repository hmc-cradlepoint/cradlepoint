import * as yup from 'yup';

export const testSchema = yup.object().shape({
  _id: yup.string().optional(),
  name: yup.string().required(),
  description: yup.string().required(),
  resultStatus: yup.string().required(),
  testCaseId: yup.string().required(),
  results: yup.array().of(
    yup.string().required()
  ).required()
});
