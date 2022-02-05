import * as yup from 'yup';

export const deviceSchema = yup.object().shape({
  _id: yup.string().optional(),
  deviceName: yup.string().required(),
  codeVersion: yup.string().required(),
  SKU: yup.string().required(),
  deviceType: yup.string().required(),
});