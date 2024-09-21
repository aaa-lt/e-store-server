import { Router } from "express";
import verifyToken from "../middleware/verifyToken.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import orderController from "../controllers/orders.controller.js";
import {
    validateBody,
    validateQuery,
} from "../middleware/validator.middleware.js";
import {
    orderCreationSchema,
    orderUpdateSchema,
} from "../schemas/order.schema.js";
import { getAllSchema } from "../schemas/pagination.schema.js";

const router = Router();

/**
 * @openapi
 * '/orders':
 *  get:
 *     tags:
 *     - Order Controller
 *     summary: Get orders
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
 *     security:
 *     - Authorization: []
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get(
    "/",
    verifyToken,
    isAdmin,
    validateQuery(getAllSchema),
    orderController.getOrdersController
);

/**
 * @openapi
 * '/orders/{id}':
 *  get:
 *     tags:
 *     - Order Controller
 *     summary: Get specified order
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the order to get
 *     security:
 *       - Authorization: []
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      404:
 *        description: Not found
 *      500:
 *        description: Server Error
 */

router.get("/:id", verifyToken, orderController.getOrder);

/**
 * @openapi
 * '/orders':
 *  post:
 *     tags:
 *     - Order Controller
 *     summary: Create an order
 *     security:
 *       - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - products
 *            properties:
 *              products:
 *                type: array
 *                default: [{"ProductId": 1, "quantity": 1}]
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */

router.post(
    "/",
    verifyToken,
    validateBody(orderCreationSchema),
    orderController.createOrderController
);

/**
 * @openapi
 * '/orders/{id}':
 *  patch:
 *     tags:
 *     - Order Controller
 *     summary: Change status of an order
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the order to put
 *     security:
 *       - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - products
 *            properties:
 *              status:
 *                type: string
 *                enum: [Pending, Shipped, Delivered, Cancelled]
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
    validateBody(orderUpdateSchema),
    orderController.putOrder
);

export default router;
