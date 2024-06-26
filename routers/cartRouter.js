const express = require('express');
const cartEntryRouter = require('./cartEntryRouter');

const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');
const sessionController = require('../controllers/sessionController');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: User's cart management
 */
router
  .route('/')
  /**
   * @swagger
   * /users/{id}/carts:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Carts]
   *     summary: Get carts
   *     description: Get list of user's carts.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/fields'
   *     responses:
   *       200:
   *         description: List of found user's cart documents.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/cartsSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(
    authController.protect,
    sessionController.handleUserId,
    cartController.getAllCarts,
  )
  /**
   * @swagger
   * /users/{id}/carts:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Carts]
   *     summary: Create cart
   *     description: Create a new cart.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/currency'
   *     requestBody:
   *       description: A JSON object containing cart payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               currency:
   *                 type: string
   *           example:
   *             currency: USD
   *     responses:
   *       201:
   *         description: Created cart document.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/cartSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .post(
    authController.protect,
    sessionController.handleUserId,
    cartController.oneSessionCartAllowed,
    cartController.assignUserToCart,
    cartController.createCart,
  );

router
  .route('/:cartId')
  /**
   * @swagger
   * /users/{id}/carts/{cartId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Carts]
   *     summary: Get cart
   *     description: Get an existing cart for a user by provided user's <code>id</code> or <code>email</code> and cart <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found cart document, if exists.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/cartSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(
    authController.protect,
    sessionController.handleUserId,
    cartController.getCart,
  )
  /**
   * @swagger
   * /users/{id}/carts/{cartId}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Carts]
   *     summary: Update cart
   *     description: Update an existing cart for a user by provided user's <code>id</code> or <code>email</code> and cart <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     requestBody:
   *       description: A JSON object containing cart payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Cart'
   *     responses:
   *       200:
   *         description: Updated cart document.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/cartSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(
    authController.protect,
    sessionController.handleUserId,
    cartController.updateCart,
  )
  /**
   * @swagger
   * /users/{id}/carts/{cartId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Carts]
   *     summary: Delete cart
   *     description: Delete an existing cart for a user by provided user's <code>id</code> or <code>email</code> and cart <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(
    authController.protect,
    sessionController.handleUserId,
    cartController.deleteCart,
  );

router.use('/:cartId/entries', cartEntryRouter);

module.exports = router;
