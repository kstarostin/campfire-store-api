const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const DocumentSanitizer = require('../utils/documentSanitizer');
const RequestBodySanitizer = require('../utils/requestBodySanitizer');

/**
 * Build a filter condition for request parameters: userId and cartId,
 * when the request is structured for getting multiple documents.
 * @returns the filter condition.
 */
const getIdConditionsForMany = async (req) => {
  const filter = {};
  if (req.params.cartId || req.params.orderId) {
    filter.parent = req.params.cartId ? req.params.cartId : req.params.orderId;
  } else if (req.params.userId) {
    filter.user = req.params.userId;
  }
  // console.log(filter);
  return filter;
};

/**
 * Build a filter condition for request parameters: userId, cartId and entryId,
 * when the request is structured for one document.
 * @returns the filter condition.
 */
const getIdConditionsForOne = async (req) => {
  const filter = {};
  if (req.params.entryId) {
    filter.parent = req.params.cartId ? req.params.cartId : req.params.orderId;
    filter._id = req.params.entryId;
  } else if (req.params.cartId || req.params.orderId) {
    filter.user = req.params.userId;
    filter._id = req.params.cartId ? req.params.cartId : req.params.orderId;
  } else if (req.params.userId) {
    filter._id = req.params.userId;
  } else if (req.params.id) {
    filter._id = req.params.id;
  }
  // console.log(filter);
  return filter;
};

// Generic CRUD operations, can be applied to any model.

/**
 * Generic function to get all documents of provided model type.
 * @param {*} Model the model type.
 * @param {*} limitOptions contains the number of returned results
 * (if nothing else is pecified in the qury parameter) and the maximal number of returned results.
 * @returns a successful response with the list of found documents, if any. Otherwise, with an empty list.
 */
exports.getAll = (Model, limitOptions) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET objects on user
    const filter = await getIdConditionsForMany(req);
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .paginate(limitOptions)
      .sort()
      .limitFields()
      .filter();
    // Retrieve total count of documents. If filter is empty - use more efficient way.
    const totalCount =
      Object.keys(features.resultFilter).length === 0 &&
      features.resultFilter.constructor === Object
        ? await Model.estimatedDocumentCount()
        : await Model.countDocuments(features.resultFilter);
    // const documents = await features.dbQuery.explain();
    const documents = (await features.dbQuery).map((document) =>
      new DocumentSanitizer(req.language, req.currency, 8).sanitize(document),
    );

    const numberPages =
      totalCount > 0 ? Math.ceil(totalCount / documents.length) : 1;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      resultsFound: documents.length,
      resultsPerPage: features.limit,
      resultsTotal: totalCount,
      currentPage: features.page,
      pages: numberPages,
      data: {
        documents,
      },
    });
  });

/**
 * Generic function to get an exact document by ID of provided model type.
 * @param {*} Model the model type.
 * @param {*} populateOptions specifies additional fields to populate.
 * @returns a successful response with the found document, if such exists, or an error response.
 */
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET objects on user
    const filter = await getIdConditionsForOne(req);

    let query = Model.findOne(filter);
    if (
      populateOptions &&
      Array.isArray(populateOptions) &&
      populateOptions.length > 0
    ) {
      populateOptions.forEach((options) => {
        query = query.populate(options);
      });
    }
    let document = await query;

    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }
    document = new DocumentSanitizer(req.language, req.currency, 7).sanitize(
      document,
    );

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

/**
 * Generic function to create a new document of provided model type.
 * @param {*} Model the model type.
 * @returns a successful response with the created document.
 */
exports.createOne = (Model, bodySanitizerWhitelist = []) =>
  catchAsync(async (req, res, next) => {
    // Sanitize request body
    req.body = new RequestBodySanitizer(bodySanitizerWhitelist).sanitize(
      req.body,
    );
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument,
      },
    });
  });

/**
 * Generic function to update an exact document by ID of provided model type.
 * @param {*} Model the model type.
 * @returns a successful response with the updated document, if it was found and updated,
 * or an error response.
 */
exports.updateOne = (Model, bodySanitizerWhitelist = []) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET objects on user
    const filter = await getIdConditionsForOne(req);
    // Sanitize request body
    req.body = new RequestBodySanitizer(bodySanitizerWhitelist).sanitize(
      req.body,
    );
    // Perform update
    let document = await Model.findOneAndUpdate(
      filter,
      { ...req.body, ...{ updatedAt: Date.now() } },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

    // Sanitize response document
    document = new DocumentSanitizer(req.language, req.currency, 7).sanitize(
      document,
    );

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

/**
 * Generic function to delete an exact document by ID of provided model type.
 * @param {*} Model the model type.
 * @returns a successful response, if the document was found and deleted, or an error response.
 */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET objects on user
    const filter = await getIdConditionsForOne(req);

    const document = await Model.findOneAndDelete(filter);

    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
