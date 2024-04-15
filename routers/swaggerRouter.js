const express = require('express');

const router = express.Router();

router.route('/').get((req, res, next) => res.redirect('/api/v1/api-docs'));

module.exports = router;
