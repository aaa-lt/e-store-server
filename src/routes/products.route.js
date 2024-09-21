import { Router } from "express";
import verifyToken from "../middleware/verifyToken.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import * as productController from "../controllers/products.controller.js";
import {
    validateBody,
    validateQuery,
} from "../middleware/validator.middleware.js";
import {
    getAllProductsSchema,
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
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - category_id
 *             - -category_id
 *             - supplier_id
 *             - -supplier_id
 *             - price
 *             - -price
 *             - creation_date
 *             - -creation_date
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: creationDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-08-17
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *       - in: query
 *         name: categoryName
 *         schema:
 *           type: string
 *       - in: query
 *         name: supplierName
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get(
    "/",
    validateQuery(getAllProductsSchema),
    productController.getProducts
);

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
 *  patch:
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

router.patch(
    "/:id",
    verifyToken,
    isAdmin,
    validateBody(productUpdateSchema),
    productController.updateProduct
);

/**
 * @openapi
 * '/products/{id}':
 *  delete:
 *     tags:
 *     - Product Controller
 *     summary: Delete the product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to update
 *     security:
 *       - Authorization: []
 *
 *
 *     responses:
 *      200:
 *        description: Deleted
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */

router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

export default router;
