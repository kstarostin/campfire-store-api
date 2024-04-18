const { allowedLanguages } = require('./config');

module.exports = (options, currentLang) => {
  if (!Array.isArray(options) || options.length === 0) {
    return '';
  }
  const selectString = allowedLanguages
    .filter((lang) => lang !== currentLang)
    .map((lang) => options.map((option) => `-${option}.${lang}`).join(' '))
    .join(' ');
  // console.log(selectString);
  return selectString;
};
