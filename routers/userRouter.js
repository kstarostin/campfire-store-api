const express = require('express');
const cartRouter = require('./cartRouter');

const userController = require('../controllers/userController');

const router = express.Router();

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
   *     tags: [Users]
   *     summary: Get users
   *     description: Get list of users. The results can be filtered, sorted, paginated and limited using special query parameters.
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
   */
  .get(userController.getAllUsers)
  /**
   * @swagger
   * /users:
   *   post:
   *     tags: [Users]
   *     summary: Create user
   *     description: Create a new user.
   *     parameters:
   *       - name: name
   *         description: User name.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: email
   *         description: User email.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       201:
   *         description: Created user.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   */
  .post(userController.createUser);

router
  .route('/:userId')
  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     tags: [Users]
   *     summary: Get user
   *     description: Get an existing user by provided ID or email.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *     responses:
   *       200:
   *         description: Found user, if exists.
   */
  .get(userController.getUser)
  /**
   * @swagger
   * /users/{id}:
   *   patch:
   *     tags: [Users]
   *     summary: Update user
   *     description: Update an existing user by provided ID or email.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - name: name
   *         description: User name.
   *         in: formData
   *         type: string
   *       - name: email
   *         description: User email.
   *         in: formData
   *         type: string
   *     responses:
   *       200:
   *         description: Updated user.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   */
  .patch(userController.updateUser)
  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     tags: [Users]
   *     summary: Delete user
   *     description: Delete an existing user by provided ID or email.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *     responses:
   *       204:
   *         description: No content.
   */
  .delete(userController.deleteUser);

router.use('/:userId/carts', cartRouter);

module.exports = router;
