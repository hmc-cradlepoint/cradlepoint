import * as yup from 'yup';
const { ObjectId } = require('bson');

// See: https://github.com/jquense/yup/issues/467
class ObjectIdSchema extends yup.mixed {
  constructor() {
    super({ type: 'objectId' });

    this.withMutation(schema => {
      schema.transform(function(value) {
        if (this.isType(value)) return value;
        return new ObjectId(value);
      });
    });
  }
  
  _typeCheck(value) {
    return ObjectId.isValid(value);
  }
}
yup.ObjectId = () => new ObjectIdSchema();

export const engagementSchema = yup.object().shape({
  name: yup.string().required(),
  statusCode: yup.number().positive().integer().required(),
  engagementDetails: yup.string().required(),
  SE: yup.string().matches(/^\d+$/),
  POC_Engineer: yup.string().matches(/^\d+$/),
  customer: yup.string().required(),
  SFDC: yup.string().url(),
  BOM: yup.array().required(),
  testplanID: yup.ObjectId.required(),
  createdOn: yup.date().default(function () {
    return new Date();
  }).required(),
});
