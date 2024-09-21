import { Router } from "express";
import verifyToken from "../middleware/verifyToken.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import * as categoryController from "../controllers/categories.controller.js";
import { validateBody } from "../middleware/validator.middleware.js";
import {
    categoryCreationSchema,
    categoryUpdateSchema,
} from "../schemas/category.schema.js";

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
    validateBody(categoryCreationSchema),
    categoryController.createCategory
);

/**
 * @openapi
 * '/categories/{id}':
 *  patch:
 *     tags:
 *     - Category Controller
 *     summary: Update the category
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the category to update
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
 *      200:
 *        description: Updated
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */

router.patch(
    "/:id",
    verifyToken,
    isAdmin,
    validateBody(categoryUpdateSchema),
    categoryController.updateCategory
);

export default router;
