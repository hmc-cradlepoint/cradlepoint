import * as yup from 'yup';

export const resultSchema = yup.object().shape({
  _id: yup.string().optional(),
  description: yup.string().required(),
  // POCApproval: yup.string().matches(/^\d+$/),
  // SEApproval: yup.string().matches(/^\d+$/),
  evidence: yup.string().optional(),
  testId: yup.string().required(),
  resultStatus: yup.string().required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }).required()
});