module.exports = async (value, respond, modelName) => {
  // console.log(value);
  if (!value) {
    return true;
  }
  return await modelName
    .countDocuments({ _id: value })
    .exec()
    .then((count) => count > 0)
    .catch((err) => {
      throw err;
    });
};
