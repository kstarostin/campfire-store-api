const express = require('express');

const router = express.Router();

// Redirects from the default path '/' to the Swagger UI with API docs.
router.route('/').get((req, res, next) => res.redirect('/api/v1/api-docs'));

module.exports = router;
