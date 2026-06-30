const express = require('express');

const authController = require('../controllers/authController');
const sessionController = require('../controllers/sessionController');
const wishlistEntryController = require('../controllers/wishlistEntryController');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Wishlist entries
 *   description: Wishlist entry management
 */
router
  .route('/')
  /**
   * @swagger
   * /users/{id}/wishlists/{wishlistId}/entries:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Wishlist entries]
   *     summary: Get wishlist entries
   *     description: Get list of wishlist entries for a user's wishlist. The results can be filtered, sorted, paginated and limited using special query parameters.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/wishlistId'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: List of found wishlist entry documents.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/wishlistEntriesSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(
    authController.protect,
    sessionController.handleUserIdWishlistId,
    wishlistEntryController.getAllEntries,
  )
  /**
   * @swagger
   * /users/{id}/wishlists/{wishlistId}/entries:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Wishlist entries]
   *     summary: Create wishlist entry
   *     description: Add a product to a wishlist.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/wishlistId'
   *     requestBody:
   *       description: A JSON object containing wishlist entry payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [product]
   *             properties:
   *               product:
   *                 type: string
   *     responses:
   *       201:
   *         description: Created wishlist entry document.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/wishlistEntrySchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   *       409:
   *         description: Product is already in the wishlist.
   */
  .post(
    authController.protect,
    sessionController.handleUserIdWishlistId,
    wishlistEntryController.assignEntryToWishlist,
    wishlistEntryController.createEntry,
  );

router
  .route('/:entryId')
  /**
   * @swagger
   * /users/{id}/wishlists/{wishlistId}/entries/{entryId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Wishlist entries]
   *     summary: Get wishlist entry
   *     description: Get an existing wishlist entry for a user by provided user's <code>id</code> or <code>email</code>, wishlist <code>id</code> and entry <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/wishlistId'
   *       - $ref: '#/parameters/entryId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found wishlist entry document, if exists.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/wishlistEntrySchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(
    authController.protect,
    sessionController.handleUserIdWishlistId,
    wishlistEntryController.getEntry,
  )
  /**
   * @swagger
   * /users/{id}/wishlists/{wishlistId}/entries/{entryId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Wishlist entries]
   *     summary: Delete wishlist entry
   *     description: Remove a product from a wishlist by entry <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/wishlistId'
   *       - $ref: '#/parameters/entryId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(
    authController.protect,
    sessionController.handleUserIdWishlistId,
    wishlistEntryController.deleteEntry,
  );

module.exports = router;
