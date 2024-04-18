const { allowedLanguages } = require('./config');

module.exports = (options, sessionLang) => {
  if (!Array.isArray(options) || options.length === 0) {
    return '';
  }
  const selectString = allowedLanguages
    .filter((lang) => lang !== sessionLang)
    .map((lang) => options.map((option) => `-${option}.${lang}`).join(' '))
    .join(' ');
  // console.log(selectString);
  return selectString;
};
