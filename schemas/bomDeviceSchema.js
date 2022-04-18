import * as yup from 'yup';
import { objectIdTest } from './objectIdTest';

export const bomDeviceSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id", false)).required(),
  deviceId: yup.string().test(objectIdTest("deviceId", false)).required(),
  quantity: yup.number().positive().required(),
  isOptional: yup.boolean().required(),
});