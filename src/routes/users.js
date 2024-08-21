import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import userController from "../controllers/users.js";

const router = Router();

/**
 * @openapi
 * '/users/me':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get user profile
 *     security:
 *       - Authorization: []
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/me", verifyToken, userController.getMyUser);

/**
 * @openapi
 * '/users/{id}':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get specific user profile
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to get
 *     security:
 *       - Authorization: []
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/:id", verifyToken, isAdmin, userController.getUser);

export default router;
