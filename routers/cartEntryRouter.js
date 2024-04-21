const express = require('express');

const genericOrderEntryController = require('../controllers/genericOrderEntryController');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Cart entries
 *   description: Cart entry management
 */
router
  .route('/')
  /**
   * @swagger
   * /users/{id}/carts/{cartId}/entries:
   *   get:
   *     tags: [Cart entries]
   *     summary: Get cart entriess
   *     description: Get list of cart entries. The results can be filtered, sorted, paginated and limited using special query parameters.
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *     responses:
   *       200:
   *         description: List of found cart entries.
   */
  .get(genericOrderEntryController.getAllEntries);

router
  .route('/:entryId')
  /**
   * @swagger
   * /users/{id}/carts/{cartId}/entries/{entryId}:
   *   get:
   *     tags: [Cart entries]
   *     summary: Get cart entry
   *     description: Get an existing cart entry for a user by provided user's ID or email, cart ID and entry ID.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/entryId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found cart entry, if exists.
   */
  .get(genericOrderEntryController.getEntry);

module.exports = router;
