import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import supplierController from "../controllers/suppliers.js";

const router = Router();

/**
 * @openapi
 * '/suppliers':
 *  get:
 *     tags:
 *     - Supplier Controller
 *     summary: Get product suppliers
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/", supplierController.getSuppliers);

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
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */

router.post("/", verifyToken, isAdmin, supplierController.createSupplier);

export default router;
