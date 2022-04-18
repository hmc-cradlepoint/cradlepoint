const { ObjectId } = require('mongodb');

export function objectIdTest(name, isOptional) {
    return (isOptional ? {
      name: name,
      message: (name + " is not a valid ObjectId"),
      test: val => val === undefined || ObjectId.isValid(val)
    } : {
      name: name,
      message: (name + " is not a valid ObjectId"),
      test: val => ObjectId.isValid(val)
    })
  }