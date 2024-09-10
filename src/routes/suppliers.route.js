import { Router } from "express";
import verifyToken from "../middleware/verifyToken.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import supplierController from "../controllers/suppliers.controller.js";
import {
    validateBody,
    validateQuery,
} from "../middleware/validator.middleware.js";
import { supplierCreationSchema } from "../schemas/supplier.schema.js";
import { getAllSchema } from "../schemas/search.schema.js";

const router = Router();

/**
 * @openapi
 * '/suppliers':
 *  get:
 *     tags:
 *     - Supplier Controller
 *     summary: Get product suppliers
 *     parameters:
 *       - in: query
 *         name: pageSize
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

router.get("/", validateQuery(getAllSchema), supplierController.getSuppliers);

/**
 * @openapi
 * '/suppliers':
 *  post:
 *     tags:
 *     - Supplier Controller
 *     summary: Create a supplier
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
 *              contact_email:
 *                type: string
 *                default: any@gmail.com
 *              phone_number:
 *                type: string
 *                default: "+375123456789"
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad request
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */

router.post(
    "/",
    verifyToken,
    isAdmin,
    validateBody(supplierCreationSchema),
    supplierController.createSupplier
);

export default router;
