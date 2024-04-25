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
   *     description: Get list of user's carts. The results can be filtered, sorted, paginated and limited using special query parameters.<br><br>This resource is protected and requires prior authorization.
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *     responses:
   *       200:
   *         description: List of found user's carts.
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
   *             $ref: '#/definitions/Cart'
   *     responses:
   *       201:
   *         description: Created cart.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Cart'
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
   *     description: Get an existing cart for a user by provided user's ID or email and cart ID.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found cart, if exists.
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
   *     description: Update an existing cart for a user by provided user's ID or email and cart ID.<br><br>This resource is protected and requires prior authorization.
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
   *         description: Updated cart.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Cart'
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
   *     description: Delete an existing cart for a user by provided user's ID or email and cart ID.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *     responses:
   *       204:
   *         description: No content.
   */
  .delete(
    authController.protect,
    sessionController.handleUserId,
    cartController.deleteCart,
  );

router.use('/:cartId/entries', cartEntryRouter);

module.exports = router;
