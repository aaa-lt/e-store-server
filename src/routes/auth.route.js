import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validator.middleware.js";
import {
    userLoginSchema,
    userRegistrationSchema,
} from "../schemas/user.schema.js";

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

router.post(
    "/register",
    validateBody(userRegistrationSchema),
    authController.userRegisterController
);

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
 *        description: Logged in
 *      401:
 *        description: Authentication failed
 *      500:
 *        description: Server Error
 */

router.post(
    "/login",
    validateBody(userLoginSchema),
    authController.userLoginController
);

/**
 * @openapi
 * '/auth/refresh':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Refresh access token
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - refreshToken
 *            properties:
 *              refreshToken:
 *                type: string
 *                default: "Bearer "
 *     responses:
 *      200:
 *        description: Refreshed
 *      401:
 *        description: No token provided
 *      500:
 *        description: Server Error
 */

router.post("/refresh", authController.resfreshAccessTokenController);

/**
 * @openapi
 * '/auth/oauth':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Google oauth
 *     responses:
 *      200:
 *        description: Refreshed
 *      401:
 *        description: No token provided
 *      500:
 *        description: Server Error
 */

router.get("/oauth", authController.googleLoginController);
router.post("/request", authController.googleRequestController);

export default router;
