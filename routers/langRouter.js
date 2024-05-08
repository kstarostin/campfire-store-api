const express = require('express');

const langController = require('../controllers/langController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Languages
 *   description: Language management
 */
router
  .route('/')
  /**
   * @swagger
   * /languages:
   *   get:
   *     tags: [Languages]
   *     summary: Get languages
   *     description: Get list of languages.
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: List of supported languages.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/languagesSchema'
   */
  .get(langController.getAllLanguages);

module.exports = router;
