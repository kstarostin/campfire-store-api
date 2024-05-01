const express = require('express');
const cartRouter = require('./cartRouter');
const orderRouter = require('./orderRouter');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

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
   *     description: Get list of users. The results can be filtered, sorted, paginated and limited using special query parameters.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *       - in: query
   *         name: filter
   *         description: JSON string with parameter names and values to filter by.<br><br>Supported query conditions&#58; <code>$gt</code>, <code>$gte</code>, <code>$lt</code>, <code>$lte</code>, <code>$in</code>, <code>$or</code>, <code>$regex</code>, etc. Find more at <a target="_blank" href="https://www.mongodb.com/docs/manual/reference/operator/query/">Query and Projection Operators</a>.<br><br>Supported value types&#58; <code>string</code>, <code>number</code>, <code>boolean</code>, <code>object</code>, <code>array</code>.<br><br>Example&#58; <code>{ "name"&#58; { "$regex"&#58; "sarah", "$options"&#58; "i" } }</code>.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
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
   *     description: Get an existing user by provided <code>id</code> or <code>email</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>. Users without this role can only request themselves.
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
   *     summary: Update user or upload photo
   *     description: Update an existing user by provided <code>id</code> or <code>email</code>. Alternatively, this endpoint can be used to upload/replace user's photo. Allowed image formats are <code>.jpeg</code>, <code>.png</code> and <code>.webp</code>. Recommended minimum image size is 500x500.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>. Users without this role can only update themselves.
   *     consumes:
   *       - application/json
   *       - multipart/form-data
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/language'
   *     requestBody:
   *       description: A JSON object containing user payload or a form with user photo image.
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/User'
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               photo:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Updated user document.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(
    authController.restrictTo('admin', 'me'),
    userController.validateExistence,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser,
  )
  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Users]
   *     summary: Delete user
   *     description: Delete an existing user by provided <code>id</code> or <code>email</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(authController.restrictTo('admin'), userController.deleteUser);

router
  .route('/:userId/photos/:photoId')
  /**
   * @swagger
   * /users/{id}/photos/{photoId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Users]
   *     summary: Delete user photo
   *     description: Delete a user's photo by provided user's <code>id</code> or <code>email</code> and photo <code>id</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>. Users without this role can only remove photos of themselves.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/photoId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(
    authController.restrictTo('admin', 'me'),
    userController.deleteUserPhoto,
  );

router.use('/:userId/carts', cartRouter);
router.use('/:userId/orders', orderRouter);

module.exports = router;
