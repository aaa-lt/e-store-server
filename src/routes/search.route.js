import { Router } from "express";
import searchController from "../controllers/search.controller.js";
import { validateQuery } from "../middleware/validator.middleware.js";
import { searchQuerySchema } from "../schemas/search.schema.js";

const router = Router();

/**
 * @openapi
 * '/search':
 *  get:
 *     tags:
 *     - Search Controller
 *     summary: Search through the products
 *     parameters:
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
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/", validateQuery(searchQuerySchema), searchController);

export default router;
