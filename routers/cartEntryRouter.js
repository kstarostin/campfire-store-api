const express = require('express');

const genericOrderEntryController = require('../controllers/genericOrderEntryController');
const sessionController = require('../controllers/sessionController');

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
   *     summary: Get cart entries
   *     description: Get list of cart entries for a user's cart. The results can be filtered, sorted, paginated and limited using special query parameters.
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
  .get(
    sessionController.handleUserIdCartId,
    genericOrderEntryController.getAllEntries,
  )
  /**
   * @swagger
   * /users/{id}/carts/{cartId}/entries:
   *   post:
   *     tags: [Cart entries]
   *     summary: Create cart entry
   *     description: Create a new cart entry.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *     requestBody:
   *       description: A JSON object containing cart entry payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/GenericOrderEntry'
   *     responses:
   *       201:
   *         description: Created cart entry.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/GenericOrderEntry'
   */
  .post(
    sessionController.handleUserIdCartId,
    genericOrderEntryController.assignEntryToCart,
    genericOrderEntryController.createEntry,
  );

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
  .get(
    sessionController.handleUserIdCartId,
    genericOrderEntryController.getEntry,
  )
  /**
   * @swagger
   * /users/{id}/carts/{cartId}/entries/{entryId}:
   *   patch:
   *     tags: [Cart entries]
   *     summary: Update cart entry
   *     description: Update an existing cart entry for a user by provided user's ID or email, cart ID and entry ID.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/entryId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     requestBody:
   *       description: A JSON object containing cart entry payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/GenericOrderEntry'
   *     responses:
   *       200:
   *         description: Updated cart entry.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/GenericOrderEntry'
   */
  .patch(
    sessionController.handleUserIdCartId,
    genericOrderEntryController.updateEntry,
  )
  /**
   * @swagger
   * /users/{id}/carts/{cartId}/entries/{entryId}:
   *   delete:
   *     tags: [Cart entries]
   *     summary: Delete cart entry
   *     description: Delete an existing cart entry for a user by provided user's ID or email, cart ID and entry ID.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/entryId'
   *     responses:
   *       204:
   *         description: No content.
   */
  .delete(
    sessionController.handleUserIdCartId,
    genericOrderEntryController.deleteEntry,
  );

module.exports = router;
