import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import categoryController from "../controllers/categories.js";

const router = Router();

/**
 * @openapi
 * '/categories':
 *  get:
 *     tags:
 *     - Category Controller
 *     summary: Get product categories
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/", categoryController.getCategories);

/**
 * @openapi
 * '/categories':
 *  post:
 *     tags:
 *     - Category Controller
 *     summary: Create a category
 *     security:
 *       - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - user
 *            properties:
 *              name:
 *                type: string
 *                default: any
 *              description:
 *                type: string
 *                default: any
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */

router.post("/", verifyToken, isAdmin, categoryController.createCategory);

export default router;
