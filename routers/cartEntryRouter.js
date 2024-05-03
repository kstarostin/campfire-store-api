const express = require('express');

const authController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');
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
   *     security:
   *       - bearerAuth: []
   *     tags: [Cart entries]
   *     summary: Get cart entries
   *     description: Get list of cart entries for a user's cart. The results can be filtered, sorted, paginated and limited using special query parameters.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *       - in: query
   *         name: filter
   *         description: JSON string with parameter names and values to filter by.<br><br>Supported query conditions&#58; <code>$gt</code>, <code>$gte</code>, <code>$lt</code>, <code>$lte</code>, <code>$in</code>, <code>$or</code>, <code>$regex</code>, etc. Find more at <a target="_blank" href="https://www.mongodb.com/docs/manual/reference/operator/query/">Query and Projection Operators</a>.<br><br>Supported value types&#58; <code>string</code>, <code>number</code>, <code>boolean</code>, <code>object</code>, <code>array</code>.<br><br>Example&#58; <code>{ "price"&#58; { "$gt"&#58; 1500 }, "quantity"&#58; { "$gte"&#58; 2 } }</code>.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *     responses:
   *       200:
   *         description: List of found cart entry documents.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/definitions/GenericOrderEntry'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(
    authController.protect,
    sessionController.handleUserIdCartId,
    genericOrderEntryController.getAllEntries,
  )
  /**
   * @swagger
   * /users/{id}/carts/{cartId}/entries:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Cart entries]
   *     summary: Create cart entry
   *     description: Create a new cart entry.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *     requestBody:
   *       description: A JSON object containing cart entry payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               product:
   *                 type: string
   *               quantity:
   *                 type: number
   *               parent:
   *                 type: string
   *     responses:
   *       201:
   *         description: Created cart entry document.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               $ref: '#/definitions/GenericOrderEntry'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .post(
    authController.protect,
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
   *     security:
   *       - bearerAuth: []
   *     tags: [Cart entries]
   *     summary: Get cart entry
   *     description: Get an existing cart entry for a user by provided user's <code>id</code> or <code>email</code>, cart <code>id</code> and entry <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/entryId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found cart entry document, if exists.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               $ref: '#/definitions/GenericOrderEntry'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(
    authController.protect,
    sessionController.handleUserIdCartId,
    genericOrderEntryController.getEntry,
  )
  /**
   * @swagger
   * /users/{id}/carts/{cartId}/entries/{entryId}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Cart entries]
   *     summary: Update cart entry
   *     description: Update an existing cart entry for a user by provided user's <code>id</code> or <code>email</code>, cart <code>id</code> and entry <code>id</code>.<br><br>This resource is protected and requires prior authorization.
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
   *             type: object
   *             properties:
   *               quantity:
   *                 type: number
   *     responses:
   *       200:
   *         description: Updated cart entry document.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               $ref: '#/definitions/GenericOrderEntry'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(
    authController.protect,
    sessionController.handleUserIdCartId,
    genericOrderEntryController.updateEntry,
  )
  /**
   * @swagger
   * /users/{id}/carts/{cartId}/entries/{entryId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Cart entries]
   *     summary: Delete cart entry
   *     description: Delete an existing cart entry for a user by provided user's <code>id</code> or <code>email</code>, cart <code>id</code> and entry <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/entryId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(
    authController.protect,
    sessionController.handleUserIdCartId,
    genericOrderEntryController.deleteEntry,
  );

module.exports = router;
