import * as yup from 'yup';

export const resultSchema = yup.object().shape({
  _id: yup.string().optional(),
  description: yup.string().required(),
  evidence: yup.string().optional(),
  resultStatus: yup.string().required(),
  testId: yup.string().required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }).required()
});