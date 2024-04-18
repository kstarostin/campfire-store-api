module.exports = (documents, sessionCurrency) => {
  if (!Array.isArray(documents) || documents.length === 0) {
    return documents;
  }

  return documents.map((document) => {
    if (!document.prices) {
      return document;
    }
    document.prices = document.prices.filter(
      (price) => price.currency === sessionCurrency,
    );
    return document;
  });
};
