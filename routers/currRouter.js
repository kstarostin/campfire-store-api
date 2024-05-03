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
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   code:
   *                     type: string
   */
  .get(currController.getAllCurrencies);

module.exports = router;
