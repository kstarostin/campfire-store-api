const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authorization
 *   description: Authentication and authorization
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags: [Authorization]
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
 *         description: Contains authentication token and created user.<br><br>Use this token in the authorize section to get access to protected resources.
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 */
router.post('/signup', authController.signup);
/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Authorization]
 *     summary: Log in
 *     description: Log in to an existing user account.
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
 *           example:
 *             email: rtaylor@digitalocean.io
 *             password: test1234
 *     responses:
 *       200:
 *         description: Contains authentication token and authenticated user.<br><br>Use this token in the authorize section to get access to protected resources.
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 */
router.post('/login', authController.login);
/**
 * @swagger
 * /users/logout:
 *   get:
 *     tags: [Authorization]
 *     summary: Log out
 *     description: Log out from the current user account.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Response status.<br><br>The authentication token is invalidated and can't be used anymore for protected resources.
 */
router.get('/logout', authController.logout);

module.exports = router;
