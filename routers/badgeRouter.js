const express = require('express');

const authController = require('../controllers/authController');
const badgeController = require('../controllers/badgeController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Badges
 *   description: Product badge management
 */
router
  .route('/')
  /**
   * @swagger
   * /badges:
   *   get:
   *     tags: [Badges]
   *     summary: Get badges
   *     description: Get list of badges. The results can be filtered, sorted, paginated and limited using special query parameters.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *     responses:
   *       200:
   *         description: List of found badge documents.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/badgesSchema'
   */
  .get(badgeController.getAllBadges)
  /**
   * @swagger
   * /badges:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Badges]
   *     summary: Create badge
   *     description: Create a new badge.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *     requestBody:
   *       description: A JSON object containing badge payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Badge'
   *     responses:
   *       201:
   *         description: Created badge document.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/badgeSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    badgeController.createBadge,
  );

router
  .route('/:id')
  /**
   * @swagger
   * /badges/{id}:
   *   get:
   *     tags: [Badges]
   *     summary: Get badge
   *     description: Get an existing badge by provided <code>id</code>.
   *     parameters:
   *       - $ref: '#/parameters/badgeId'
   *       - $ref: '#/parameters/language'
   *     responses:
   *       200:
   *         description: Found badge document, if exists.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/badgeSchema'
   */
  .get(badgeController.getBadge)
  /**
   * @swagger
   * /badges/{id}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Badges]
   *     summary: Update badge
   *     description: Update an existing badge by provided <code>id</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/badgeId'
   *       - $ref: '#/parameters/language'
   *     requestBody:
   *       description: A JSON object containing badge payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Badge'
   *     responses:
   *       200:
   *         description: Updated badge document.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/badgeSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    badgeController.updateBadge,
  )
  /**
   * @swagger
   * /badges/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Badges]
   *     summary: Delete badge
   *     description: Delete an existing badge by provided <code>id</code>. Deletion is blocked while products reference the badge.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/badgeId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   *       409:
   *         description: Badge is still assigned to one or more products.
   */
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    badgeController.deleteBadge,
  );

module.exports = router;
