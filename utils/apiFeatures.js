/**
 * Enchances API requests with additional query features like:
 * filtering, sorting, paginating.
 */
class APIFeatures {
  constructor(dbQuery, requestQuery) {
    this.dbQuery = dbQuery;
    this.requestQuery = requestQuery;
    this.resultFilter = {};
  }

  /**
   * Enables support of the request query parameter 'sort=...'.
   * @returns enchanced search query.
   */
  sort() {
    if (this.requestQuery.sort) {
      const sortBy = this.requestQuery.sort.split(',').join(' ');
      this.dbQuery = this.dbQuery.sort(sortBy);
    } else {
      this.dbQuery = this.dbQuery.sort('-createdAt');
    }

    return this;
  }

  /**
   * Enables support of the request query parameter 'fields=...'.
   * @returns enchanced search query.
   */
  limitFields() {
    if (this.requestQuery.fields) {
      const fields = this.requestQuery.fields.split(',').join(' ');
      this.dbQuery = this.dbQuery.select(fields);
    } else {
      this.dbQuery = this.dbQuery.select('-__v');
    }
    return this;
  }

  /**
   * Enables support of the request query parameters 'page=...' and 'limit=...'.
   * @param {*} limitOptions contains default limit value and maximal limit value, which can't be exceeded by the default one.
   * @returns enchanced search query.
   */
  paginate(limitOptions) {
    const defaultLimit =
      limitOptions && limitOptions.defaultLimit
        ? limitOptions.defaultLimit
        : 50;
    const maxLimit =
      limitOptions && limitOptions.maxLimit ? limitOptions.maxLimit : 100;

    const page = this.requestQuery.page * 1 || 1;
    let limit = this.requestQuery.limit * 1 || defaultLimit;
    if (limit > maxLimit) {
      limit = maxLimit;
    }
    const skip = (page - 1) * limit;

    this.dbQuery = this.dbQuery.skip(skip).limit(limit);

    this.limit = limit;
    this.page = page;

    return this;
  }

  /**
   * Enables support of filtering request query parameters.
   * The exact parameter names depend on the resource type and available fields.
   * @returns enchanced search query.
   */
  filter(filter = {}) {
    const queryObj = { ...this.requestQuery };

    const queryFilter = queryObj.filter ? JSON.parse(queryObj.filter) : {};
    const resultFilter = {
      ...filter,
      ...queryFilter,
    };

    if (Object.keys(resultFilter).length === 0) {
      return this;
    }

    this.resultFilter = resultFilter;
    console.log(this.resultFilter);

    this.dbQuery = this.dbQuery.find(this.resultFilter);

    return this;
  }
}

module.exports = APIFeatures;
