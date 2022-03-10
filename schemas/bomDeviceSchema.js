import * as yup from 'yup';

export const bomDeviceSchema = yup.object().shape({
  deviceId: yup.string().required(),
  quantity: yup.number().positive().required(),
  isOptional: yup.boolean().required(),
});