import { Router } from "express";
import { Op } from "sequelize";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";

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

router.get("/", async (req, res) => {
    try {
        const {
            name,
            creationDate,
            minPrice,
            maxPrice,
            categoryName,
            supplierName,
        } = req.query;

        const products = await Product.findAll({
            where: {
                ...(name && { name: { [Op.like]: `%${name}%` } }),
                ...(creationDate && {
                    creation_date: {
                        [Op.gte]: new Date(creationDate).setHours(0, 0, 0, 0),
                        [Op.lt]: new Date(creationDate).setHours(
                            23,
                            59,
                            59,
                            999
                        ),
                    },
                }),
                ...(minPrice &&
                    maxPrice && {
                        price: { [Op.between]: [minPrice, maxPrice] },
                    }),
                ...(minPrice &&
                    !maxPrice && {
                        price: { [Op.gte]: [minPrice] },
                    }),
                ...(maxPrice &&
                    !minPrice && {
                        price: { [Op.lte]: [maxPrice] },
                    }),
            },
            include: [
                {
                    model: Category,
                    ...(categoryName && {
                        where: { name: { [Op.like]: `%${categoryName}%` } },
                    }),
                },
                {
                    model: Supplier,
                    ...(supplierName && {
                        where: { name: { [Op.like]: `%${supplierName}%` } },
                    }),
                },
            ],
        });

        res.status(200).send(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            error: "Failed to get information",
        });
    }
});

export default router;
