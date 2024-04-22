module.exports = (value, respond, modelName) => {
  if (!value) {
    return true;
  }
  return modelName
    .countDocuments({ _id: value })
    .exec()
    .then((count) => count > 0)
    .catch((err) => {
      throw err;
    });
};
