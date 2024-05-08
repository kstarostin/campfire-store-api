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
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: List of supported currencies.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/currenciesSchema'
   */
  .get(currController.getAllCurrencies);

module.exports = router;
