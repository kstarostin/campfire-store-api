const express = require('express');

const currController = require('../controllers/currController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Currencies
 *   description: Currency management
 */
router
  .route('/')
  /**
   * @swagger
   * /currencies:
   *   get:
   *     tags: [Currencies]
   *     summary: Get currencies
   *     description: Get list of currencies.
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: List of supported currencies.
   */
  .get(currController.getAllCurrencies);

module.exports = router;
