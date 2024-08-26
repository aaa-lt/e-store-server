import { Router } from "express";
import searchController from "../controllers/search.controller.js";

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
 *
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/", searchController);

export default router;
