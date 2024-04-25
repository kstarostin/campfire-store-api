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
   *     description: Get list of users. The results can be filtered, sorted, paginated and limited using special query parameters.<br><br>This resource is protected and requires prior authorization.
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *     responses:
   *       200:
   *         description: List of found users.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(userController.getAllUsers)
  /**
   * @swagger
   * /users:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Users]
   *     summary: Create user
   *     description: Create a new user.<br><br>This resource is protected and requires prior authorization.
   *     requestBody:
   *       description: A JSON object containing user payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/User'
   *     responses:
   *       201:
   *         description: Created user.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .post(userController.createUser);

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
   *     description: Get an existing user by provided ID or email.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *     responses:
   *       200:
   *         description: Found user, if exists.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(userController.getUser)
  /**
   * @swagger
   * /users/{id}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Users]
   *     summary: Update user
   *     description: Update an existing user by provided ID or email.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *     requestBody:
   *       description: A JSON object containing user payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/User'
   *     responses:
   *       200:
   *         description: Updated user.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(userController.updateUser)
  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Users]
   *     summary: Delete user
   *     description: Delete an existing user by provided ID or email.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(userController.deleteUser);

router.use('/:userId/carts', cartRouter);
router.use('/:userId/orders', orderRouter);

module.exports = router;
