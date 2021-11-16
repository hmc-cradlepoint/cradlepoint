import * as yup from 'yup';

export const testSchema = yup.object().shape({
  details: yup.string().required(),
  name: yup.string().required(),
  results: yup.array().required(),
  testCaseId: yup.string().required(),
});
