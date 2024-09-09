import { Router } from "express";
import verifyToken from "../middleware/verifyToken.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import productController from "../controllers/products.controller.js";
import { validateBody } from "../middleware/validator.middleware.js";
import {
    productCreationSchema,
    productUpdateSchema,
} from "../schemas/product.schema.js";

const router = Router();

/**
 * @openapi
 * '/products':
 *  get:
 *     tags:
 *     - Product Controller
 *     summary: Get products
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *             - category
 *             - supplier
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/", productController.getProducts);

/**
 * @openapi
 * '/products/{id}':
 *   get:
 *     tags:
 *       - Product Controller
 *     summary: Get details of a specific product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to get
 *     responses:
 *       200:
 *         description: Fetched Successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server Error
 */

router.get("/:id", productController.getProduct);

/**
 * @openapi
 * '/products':
 *  post:
 *     tags:
 *     - Product Controller
 *     summary: Create a product
 *     security:
 *     - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *                 format: float
 *               category_id:
 *                 type: integer
 *               supplier_id:
 *                 type: integer
 *             required:
 *               - name
 *               - quantity
 *               - price
 *               - category_id
 *               - supplier_id
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
    validateBody(productCreationSchema),
    productController.createProduct
);

/**
 * @openapi
 * '/products/{id}':
 *  put:
 *     tags:
 *     - Product Controller
 *     summary: Update the product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to update
 *     security:
 *       - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                default: any
 *              description:
 *                type: string
 *                default: any
 *              quantity:
 *                type: integer
 *                default: 1
 *              price:
 *                type: integer
 *                default: 0
 *              category_id:
 *                type: integer
 *                default: 1
 *              supplier_id:
 *                type: integer
 *                default: 1
 *
 *
 *     responses:
 *      200:
 *        description: Updated
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */

router.put(
    "/:id",
    verifyToken,
    isAdmin,
    validateBody(productUpdateSchema),
    productController.updateProduct
);

export default router;
