import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import verifyToken from "../middleware/verifyToken.middleware.js";
import { validateNewUser } from "../middleware/validator.middleware.js";

const router = Router();

/**
 * @openapi
 * '/auth/register':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                default: maxra0303
 *              email:
 *                type: string
 *                default: max@gmail.com
 *              password:
 *                type: string
 *                default: MaxTrust
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */

router.post("/register", validateNewUser, authController.registerUser);

/**
 * @openapi
 * '/auth/login':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Login as a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                default: maxra0303
 *              password:
 *                type: string
 *                default: MaxTrust
 *     responses:
 *      200:
 *        description: Loggined in
 *      401:
 *        description: Authentication failed
 *      500:
 *        description: Server Error
 */

router.post("/login", authController.loginUser);

/**
 * @openapi
 * '/auth/logout':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Logout the user
 *     security:
 *       - Authorization: []
 *     responses:
 *      204:
 *        description: Logged out
 *      401:
 *        description: No token provided
 *      500:
 *        description: Server Error
 */

router.post("/logout", verifyToken, authController.logoutUser);

/**
 * @openapi
 * '/auth/refresh':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Refresh access token
 *     security:
 *       - Authorization: []
 *     responses:
 *      200:
 *        description: Created
 *      400:
 *        description: Invalid refresh token
 *      401:
 *        description: No token provided
 *      500:
 *        description: Server Error
 */

router.post("/refresh", authController.resfreshToken);

export default router;
