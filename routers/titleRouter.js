const express = require('express');

const authController = require('../controllers/authController');
const titleController = require('../controllers/titleController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Titles
 *   description: Title management
 */
router
  .route('/')
  /**
   * @swagger
   * /titles:
   *   get:
   *     tags: [Titles]
   *     summary: Get titles
   *     description: Get list of titles. The results can be filtered, sorted, paginated and limited using special query parameters.
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
   *         description: List of found title documents.
   */
  .get(titleController.getAllTitles)
  /**
   * @swagger
   * /titles:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Titles]
   *     summary: Create title
   *     description: Create a new title.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     consumes:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/language'
   *     requestBody:
   *       description: A JSON object containing title payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Title'
   *     responses:
   *       201:
   *         description: Created title document.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Title'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    titleController.createTitle,
  );

router
  .route('/:id')
  /**
   * @swagger
   * /titles/{id}:
   *   get:
   *     tags: [Titles]
   *     summary: Get title
   *     description: Get an existing title by provided <code>id</code>.
   *     parameters:
   *       - $ref: '#/parameters/titleId'
   *       - $ref: '#/parameters/language'
   *     responses:
   *       200:
   *         description: Found title document, if exists.
   */
  .get(titleController.getTitle)
  /**
   * @swagger
   * /titles/{id}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Titles]
   *     summary: Update title
   *     description: Update an existing title by provided <code>id</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     consumes:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/titleId'
   *       - $ref: '#/parameters/language'
   *     requestBody:
   *       description: A JSON object containing title payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Title'
   *     responses:
   *       200:
   *         description: Updated title document.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Title'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    titleController.updateTitle,
  )
  /**
   * @swagger
   * /titles/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Titles]
   *     summary: Delete title
   *     description: Delete an existing title by provided <code>id</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/titleId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    titleController.deleteTitle,
  );

module.exports = router;
