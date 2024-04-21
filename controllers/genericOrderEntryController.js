const GenericOrderEntry = require('../models/genericOrderEntryModel');
const factory = require('./controllerFactory');

exports.getAllEntries = factory.getAll(GenericOrderEntry, {
  defaultLimit: 25,
  maxLimit: 50,
});
exports.getEntry = factory.getOne(GenericOrderEntry);
