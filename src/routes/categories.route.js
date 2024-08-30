import { Router } from "express";
import verifyToken from "../middleware/verifyToken.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import categoryController from "../controllers/categories.controller.js";
import { validateNewCategory } from "../middleware/validator.middleware.js";

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

router.post(
    "/",
    verifyToken,
    isAdmin,
    validateNewCategory,
    categoryController.createCategory
);

export default router;
