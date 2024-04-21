const express = require('express');
const cartEntryRouter = require('./cartEntryRouter');

const cartController = require('../controllers/cartController');
const genericOrderController = require('../controllers/genericOrderController');

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
   *     tags: [Carts]
   *     summary: Get carts
   *     description: Get list of user carts. The results can be filtered, sorted, paginated and limited using special query parameters.
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
   *         description: List of found user carts.
   */
  .get(genericOrderController.validateUserId, cartController.getAllCarts)
  /**
   * @swagger
   * /users/{id}/carts:
   *   post:
   *     tags: [Carts]
   *     summary: Create cart
   *     description: Create a new cart.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *     responses:
   *       201:
   *         description: Created cart.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Cart'
   */
  .post(
    genericOrderController.validateUserId,
    cartController.assignUserToCart,
    cartController.createCart,
  );

router
  .route('/:cartId')
  /**
   * @swagger
   * /users/{id}/carts/{cartId}:
   *   get:
   *     tags: [Carts]
   *     summary: Get cart
   *     description: Get an existing cart for a user by provided user's ID or email and cart's ID.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found cart, if exists.
   */
  .get(genericOrderController.validateUserId, cartController.getCart)
  /**
   * @swagger
   * /users/{id}/carts/{cartId}:
   *   patch:
   *     tags: [Carts]
   *     summary: Update cart
   *     description: Update an existing cart for a user by provided user's ID or email and cart's ID.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Updated cart.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Cart'
   */
  .patch(genericOrderController.validateUserId, cartController.updateCart)
  /**
   * @swagger
   * /users/{id}/carts/{cartId}:
   *   delete:
   *     tags: [Carts]
   *     summary: Delete cart
   *     description: Delete an existing cart for a user by provided user's ID or email and cart's ID.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/cartId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       204:
   *         description: No content.
   */
  .delete(genericOrderController.validateUserId, cartController.deleteCart);

router.use('/:cartId/entries', cartEntryRouter);

module.exports = router;
