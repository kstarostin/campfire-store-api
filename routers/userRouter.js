const express = require('express');
const cartRouter = require('./cartRouter');
const orderRouter = require('./orderRouter');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
router
  .route('/')
  /**
   * @swagger
   * /users:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Users]
   *     summary: Get users
   *     description: Get list of users. The results can be filtered, sorted, paginated and limited using special query parameters.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without an admin role.
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *     responses:
   *       200:
   *         description: List of found user documents.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(authController.restrictTo('admin'), userController.getAllUsers);

router
  .route('/:userId')
  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Users]
   *     summary: Get user
   *     description: Get an existing user by provided ID or email.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without an admin role. Users without admin role can only request themselves.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/language'
   *     responses:
   *       200:
   *         description: Found user document, if exists.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(authController.restrictTo('admin', 'me'), userController.getUser)
  /**
   * @swagger
   * /users/{id}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Users]
   *     summary: Update user
   *     description: Update an existing user by provided ID or email.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without an admin role. Users without admin role can only update themselves.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/language'
   *     requestBody:
   *       description: A JSON object containing user payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/User'
   *     responses:
   *       200:
   *         description: Updated user document.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(authController.restrictTo('admin', 'me'), userController.updateUser)
  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Users]
   *     summary: Delete user
   *     description: Delete an existing user by provided ID or email.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without an admin role.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(authController.restrictTo('admin'), userController.deleteUser);

router.use('/:userId/carts', cartRouter);
router.use('/:userId/orders', orderRouter);

module.exports = router;
