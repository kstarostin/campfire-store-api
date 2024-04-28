const express = require('express');

const authController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');
const orderController = require('../controllers/orderController');

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
   *     security:
   *       - bearerAuth: []
   *     tags: [Orders]
   *     summary: Get orders
   *     description: Get list of user's orders. The results can be filtered, sorted, paginated and limited using special query parameters.<br><br>This resource is protected and requires prior authorization.
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *       - $ref: '#/parameters/filter'
   *     responses:
   *       200:
   *         description: List of found user's order documents.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(
    authController.protect,
    sessionController.handleUserId,
    orderController.getAllOrders,
  )
  /**
   * @swagger
   * /users/{id}/orders:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Orders]
   *     summary: Place order
   *     description: Create a new order from a cart.<br><br>This resource is protected and requires prior authorization.
   *     consumes:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *     requestBody:
   *       description: A JSON object containing user payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               cartId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Placed order document.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Order'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .post(
    authController.protect,
    sessionController.handleUserId,
    orderController.placeOrder,
  );

router
  .route('/:orderId')
  /**
   * @swagger
   * /users/{id}/orders/{orderId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Orders]
   *     summary: Get order
   *     description: Get an existing order for a user by provided user's <code>id</code> or <code>email</code> and order <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/orderId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found order document, if exists.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(
    authController.protect,
    sessionController.handleUserId,
    orderController.getOrder,
  );

module.exports = router;
