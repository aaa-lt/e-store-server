import { Router } from "express";
import verifyToken from "../middleware/verifyToken.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import * as supplierController from "../controllers/suppliers.controller.js";
import {
    validateBody,
    validateQuery,
} from "../middleware/validator.middleware.js";
import {
    supplierCreationSchema,
    supplierUpdateSchema,
} from "../schemas/supplier.schema.js";
import { getAllSchema } from "../schemas/pagination.schema.js";

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

/**
 * @openapi
 * '/suppliers/{id}':
 *  patch:
 *     tags:
 *     - Supplier Controller
 *     summary: Update the supplier
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the supplier to update
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

router.patch(
    "/:id",
    verifyToken,
    isAdmin,
    validateBody(supplierUpdateSchema),
    supplierController.updateSupplier
);

export default router;
