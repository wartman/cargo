var _ = require('lodash');
var validator = require('validator');

// Add a few custom validations.
validator.extend('empty', function (val) {
  return _.isEmpty(val);
});

validator.extend('notContains', function (val, comp) {
  return !_.contains(val, comp);
});

module.exports = validator;
