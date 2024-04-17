const express = require('express');

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
   *       - $ref: '#/parameters/currency'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *     responses:
   *       200:
   *         description: List of found categories.
   */
  .get(categoryController.getAllCategories)
  /**
   * @swagger
   * /categories:
   *   post:
   *     tags: [Categories]
   *     summary: Create category
   *     description: Create a new category.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *       - name: name
   *         description: Category name.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: parentCategory
   *         description: Parent category ID. Can be empty for a root category.
   *         in: formData
   *         type: string
   *     responses:
   *       201:
   *         description: Created category.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Category'
   */
  .post(categoryController.createCategory);

router
  .route('/:id')
  /**
   * @swagger
   * /categories/{id}:
   *   get:
   *     tags: [Categories]
   *     summary: Get category
   *     description: Get an existing category by provided ID.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of a category to search for.
   *     responses:
   *       200:
   *         description: Found category, if exists.
   */
  .get(categoryController.getCategory)
  /**
   * @swagger
   * /categories/{id}:
   *   patch:
   *     tags: [Categories]
   *     summary: Update category
   *     description: Update an existing category by provided ID.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of a category to search for.
   *       - name: name
   *         description: Category name.
   *         in: formData
   *         type: string
   *       - name: parentCategory
   *         description: Parent category ID.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Updated category.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Category'
   */
  .patch(categoryController.updateCategory)
  /**
   * @swagger
   * /categories/{id}:
   *   delete:
   *     tags: [Categories]
   *     summary: Delete category
   *     description: Delete an existing category by provided ID.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of a category to search for.
   *     responses:
   *       204:
   *         description: No content.
   */
  .delete(categoryController.deleteCategory);

module.exports = router;
