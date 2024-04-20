const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const DocumentSanitizer = require('../utils/documentSanitizer');
const User = require('../models/userModel');

const getUserIdFilter = async (req) => {
  let filter = {};
  if (req.params.userId) {
    if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
      filter = { user: req.params.userId };
    } else {
      const user = await User.findOne({
        email: req.params.userId,
      });
      filter = { user: user?._id };
    }
  }
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
    // To allow for nested GET reviews on user
    const filter = await getUserIdFilter(req);
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .paginate(limitOptions)
      .sort()
      .limitFields()
      .filter();
    // retrieve total count of documents
    const totalCount = await Model.estimatedDocumentCount();
    // const documents = await features.dbQuery.explain();
    const documents = (await features.dbQuery).map((document) =>
      new DocumentSanitizer(req.language, req.currency, 4).sanitize(document),
    );

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      resultsFound: documents.length,
      resultsPerPage: features.limit,
      resultsTotal: totalCount,
      currentPage: features.page,
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
    // To allow for nested GET reviews on user
    const filter = { _id: req.params.id, ...(await getUserIdFilter(req)) };

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
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
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
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on user
    const filter = { _id: req.params.id, ...(await getUserIdFilter(req)) };

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
    // To allow for nested GET reviews on user
    const filter = { _id: req.params.id, ...(await getUserIdFilter(req)) };

    const document = await Model.findOneAndDelete(filter);

    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
