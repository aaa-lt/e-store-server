import { Op } from "sequelize";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";

const searchProducts = async (req, res) => {
    try {
        const {
            name,
            creationDate,
            minPrice,
            maxPrice,
            categoryName,
            supplierName,
        } = req.query;

        const date = new Date(creationDate);
        date.setHours(0, 0, 0, 0);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const products = await Product.findAll({
            where: {
                ...(name && { name: { [Op.like]: `%${name}%` } }),
                ...(creationDate && {
                    creation_date: {
                        [Op.gte]: new Date(creationDate).setHours(0, 0, 0, 0),
                        [Op.lt]: date.setDate(date.getDate() + 1),
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
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });

        res.status(200).send(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};

export default searchProducts;
