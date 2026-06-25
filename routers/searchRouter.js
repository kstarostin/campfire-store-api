const express = require('express');

const searchController = require('../controllers/searchController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Product search
 */
router
  .route('/')
  /**
   * @swagger
   * /search:
   *   get:
   *     tags: [Search]
   *     summary: Search products
   *     description: Free-text search across product name, manufacturer, localized descriptions, and category names/codes.<br><br>Whitespace-separated terms are combined with <code>AND</code> — each term must match at least one searchable field.<br><br>Results use the same paginated product-list shape as <code>GET /products</code>.
   *     parameters:
   *       - $ref: '#/parameters/searchQuery'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *       - $ref: '#/parameters/profuctFilter'
   *     responses:
   *       200:
   *         description: Paginated list of matching products and applicable filters.
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/productsSchema'
   *                 - type: object
   *                   properties:
   *                     query:
   *                       type: string
   *                       description: Normalized search query echoed from the request.
   *       400:
   *         description: Invalid search query.
   */
  .get(searchController.searchProducts);

module.exports = router;
