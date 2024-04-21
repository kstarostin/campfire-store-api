const express = require('express');

const orderController = require('../controllers/orderController');
const genericOrderController = require('../controllers/genericOrderController');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */
router
  .route('/')
  /**
   * @swagger
   * /users/{id}/orders:
   *   get:
   *     tags: [Orders]
   *     summary: Get orders
   *     description: Get list of user's orders. The results can be filtered, sorted, paginated and limited using special query parameters.
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
   *         description: List of found user's orders.
   */
  .get(genericOrderController.handleUserId, orderController.getAllOrders)
  /**
   * @swagger
   * /users/{id}/orders:
   *   post:
   *     tags: [Orders]
   *     summary: Place order
   *     description: Create a new order from a cart.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - name: cartId
   *         description: Cart ID.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       201:
   *         description: Placed order.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Order'
   */
  .post(genericOrderController.handleUserId, orderController.placeOrder);

router
  .route('/:orderId')
  /**
   * @swagger
   * /users/{id}/orders/{orderId}:
   *   get:
   *     tags: [Orders]
   *     summary: Get order
   *     description: Get an existing order for a user by provided user's ID or email and order ID.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/orderId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found order, if exists.
   */
  .get(genericOrderController.handleUserId, orderController.getOrder);

module.exports = router;
