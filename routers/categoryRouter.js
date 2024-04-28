const express = require('express');

const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */
router
  .route('/')
  /**
   * @swagger
   * /categories:
   *   get:
   *     tags: [Categories]
   *     summary: Get categories
   *     description: Get list of categories. The results can be filtered, sorted, paginated and limited using special query parameters.
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *       - $ref: '#/parameters/filter'
   *     responses:
   *       200:
   *         description: List of found category documents.
   */
  .get(categoryController.getAllCategories)
  /**
   * @swagger
   * /categories:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Categories]
   *     summary: Create category
   *     description: Create a new category.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     consumes:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/language'
   *     requestBody:
   *       description: A JSON object containing category payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Category'
   *     responses:
   *       201:
   *         description: Created category document.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Category'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.createCategory,
  );

router
  .route('/:id')
  /**
   * @swagger
   * /categories/{id}:
   *   get:
   *     tags: [Categories]
   *     summary: Get category
   *     description: Get an existing category by provided <code>id</code>.
   *     parameters:
   *       - $ref: '#/parameters/categoryId'
   *       - $ref: '#/parameters/language'
   *     responses:
   *       200:
   *         description: Found category document, if exists.
   */
  .get(categoryController.getCategory)
  /**
   * @swagger
   * /categories/{id}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Categories]
   *     summary: Update category
   *     description: Update an existing category by provided <code>id</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     consumes:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/categoryId'
   *       - $ref: '#/parameters/language'
   *     requestBody:
   *       description: A JSON object containing category payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Category'
   *     responses:
   *       200:
   *         description: Updated category document.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Category'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.updateCategory,
  )
  /**
   * @swagger
   * /categories/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Categories]
   *     summary: Delete category
   *     description: Delete an existing category by provided <code>id</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/categoryId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.deleteCategory,
  );

module.exports = router;
