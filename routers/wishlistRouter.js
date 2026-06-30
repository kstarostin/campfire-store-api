const express = require('express');
const wishlistEntryRouter = require('./wishlistEntryRouter');

const authController = require('../controllers/authController');
const wishlistController = require('../controllers/wishlistController');
const sessionController = require('../controllers/sessionController');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Wishlists
 *   description: User wishlist management
 */
router
  .route('/')
  /**
   * @swagger
   * /users/{id}/wishlists:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Wishlists]
   *     summary: Get wishlists
   *     description: Get list of user's wishlists.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/fields'
   *     responses:
   *       200:
   *         description: List of found user's wishlist documents.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/wishlistsSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(
    authController.protect,
    sessionController.handleUserId,
    wishlistController.getAllWishlists,
  )
  /**
   * @swagger
   * /users/{id}/wishlists:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Wishlists]
   *     summary: Create wishlist
   *     description: Create a new wishlist.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *     requestBody:
   *       description: A JSON object containing wishlist payload.
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *           example:
   *             name: Wishlist
   *     responses:
   *       201:
   *         description: Created wishlist document.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/wishlistSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .post(
    authController.protect,
    sessionController.handleUserId,
    wishlistController.oneWishlistPerUser,
    wishlistController.assignUserToWishlist,
    wishlistController.createWishlist,
  );

router
  .route('/:wishlistId')
  /**
   * @swagger
   * /users/{id}/wishlists/{wishlistId}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags: [Wishlists]
   *     summary: Get wishlist
   *     description: Get an existing wishlist for a user by provided user's <code>id</code> or <code>email</code> and wishlist <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/wishlistId'
   *     responses:
   *       200:
   *         description: Found wishlist document, if exists.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/wishlistSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .get(
    authController.protect,
    sessionController.handleUserId,
    wishlistController.getWishlist,
  )
  /**
   * @swagger
   * /users/{id}/wishlists/{wishlistId}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Wishlists]
   *     summary: Update wishlist
   *     description: Update an existing wishlist for a user by provided user's <code>id</code> or <code>email</code> and wishlist <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/wishlistId'
   *     requestBody:
   *       description: A JSON object containing wishlist payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Updated wishlist document.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/wishlistSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(
    authController.protect,
    sessionController.handleUserId,
    wishlistController.updateWishlist,
  )
  /**
   * @swagger
   * /users/{id}/wishlists/{wishlistId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Wishlists]
   *     summary: Delete wishlist
   *     description: Delete an existing wishlist for a user by provided user's <code>id</code> or <code>email</code> and wishlist <code>id</code>.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/userIdOrEmail'
   *       - $ref: '#/parameters/wishlistId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(
    authController.protect,
    sessionController.handleUserId,
    wishlistController.deleteWishlist,
  );

router.use('/:wishlistId/entries', wishlistEntryRouter);

module.exports = router;
