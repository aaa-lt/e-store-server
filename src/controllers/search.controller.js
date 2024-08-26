import { Op } from "sequelize";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";

// TODO search date

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

        const today = new Date(creationDate).setHours(0, 0, 0, 0);

        const products = await Product.findAll({
            where: {
                ...(name && { name: { [Op.like]: `%${name}%` } }),
                ...(creationDate && {
                    creation_date: {
                        [Op.gte]: new Date(creationDate).setHours(0, 0, 0, 0),
                        [Op.lt]: today.getDate() + 1,
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
            status: "error",
            error: "Failed to get information",
        });
    }
};

export default searchProducts;
