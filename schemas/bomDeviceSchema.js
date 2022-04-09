import * as yup from 'yup';

export const bomDeviceSchema = yup.object().shape({
  _id: yup.string().required(),
  deviceId: yup.string().required(),
  quantity: yup.number().positive().required(),
  isOptional: yup.boolean().required(),
});