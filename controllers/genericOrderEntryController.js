const GenericOrderEntry = require('../models/genericOrderEntryModel');
const factory = require('./controllerFactory');

exports.assignEntryToCart = (req, res, next) => {
  if (!req.body.parent) {
    req.body.parent = req.params.cartId
      ? req.params.cartId
      : req.params.orderId;
  }
  next();
};

exports.getAllEntries = factory.getAll(GenericOrderEntry, {
  defaultLimit: 25,
  maxLimit: 50,
});
exports.getEntry = factory.getOne(GenericOrderEntry);
exports.createEntry = factory.createOne(GenericOrderEntry);
exports.updateEntry = factory.updateOne(GenericOrderEntry);
exports.deleteEntry = factory.deleteOne(GenericOrderEntry);
