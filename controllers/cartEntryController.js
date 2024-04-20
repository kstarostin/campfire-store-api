const CartEntry = require('../models/cartEntryModel');
const factory = require('./controllerFactory');

exports.getAllEntries = factory.getAll(CartEntry, {
  defaultLimit: 25,
  maxLimit: 50,
});
exports.getEntry = factory.getOne(CartEntry);
