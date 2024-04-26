const Title = require('../models/titleModel');
const factory = require('./controllerFactory');

exports.getAllTitles = factory.getAll(Title, {
  defaultLimit: 25,
  maxLimit: 100,
});
exports.getTitle = factory.getOne(Title);
exports.createTitle = factory.createOne(Title, ['code', 'nameI18n']);
exports.updateTitle = factory.updateOne(Title, ['code', 'nameI18n']);
exports.deleteTitle = factory.deleteOne(Title);
