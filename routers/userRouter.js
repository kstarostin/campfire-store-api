const express = require('express');
const cartRouter = require('./cartRouter');
const orderRouter = require('./orderRouter');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// NON-PROTECTED ROUTES

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     tags: [Auth]
 *     summary: Sign up
 *     description: Create a new user account.
 *     requestBody:
 *       description: A JSON object containing sign up payload.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created user.
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 */
router.post('/signup', authController.signup);
/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in
 *     description: Log in to an existin user account.
 *     requestBody:
 *       description: A JSON object containing log in payload.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Authenticated user.
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 */
router.post('/login', authController.login);
/**
 * @swagger
 * /logout:
 *   get:
 *     tags: [Auth]
 *     summary: Log out
 *     description: Log out from the current user account.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Response status.
 */
router.get('/logout', authController.logout);

// PROTECTED ROUTES
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
router.use('/:userId/orders', orderRouter);

module.exports = router;
