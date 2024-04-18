const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const selectI18nString = require('../utils/selectI18nString');

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
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(), req.query)
      .paginate(limitOptions)
      .sort()
      .limitFields()
      .filter();
    // const documents = await features.dbQuery.explain();
    const documents = await features.dbQuery;
    // retrieve total count of documents
    const totalCount = await Model.estimatedDocumentCount();

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
exports.getOne = (Model, populateOptions, selectI18nOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (selectI18nOptions) {
      query = query.select(selectI18nString(selectI18nOptions, req.language));
    }
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const document = await query;

    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

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
    const document = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...{ updatedAt: Date.now() } },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

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
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
