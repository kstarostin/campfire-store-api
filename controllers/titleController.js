const Title = require('../models/titleModel');
const factory = require('./controllerFactory');

exports.getAllTitles = factory.getAll(Title, {
  defaultLimit: 25,
  maxLimit: 100,
});
exports.getTitle = factory.getOne(Title);
exports.createTitle = factory.createOne(Title);
exports.updateTitle = factory.updateOne(Title);
exports.deleteTitle = factory.deleteOne(Title);
