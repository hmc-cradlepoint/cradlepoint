import * as yup from 'yup';
import { objectIdTest } from './objectIdTest';

export const libraryDeviceSchema = yup.object().shape({
  _id: yup.string().test(objectIdTest("_id", true)).optional(),
  deviceName: yup.string().required(),
  codeVersion: yup.string().required(),
  SKU: yup.string().required(),
  deviceType: yup.string().required(),
});