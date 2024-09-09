import { Op } from "sequelize";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";

export const searchProductsService = async (reqQuery) => {
    const date = new Date(reqQuery.creationDate);
    date.setHours(0, 0, 0, 0);
    const page = parseInt(reqQuery.page) || 1;
    const pageSize = parseInt(reqQuery.pageSize) || 10;

    return await Product.findAll({
        where: {
            ...(reqQuery.name && { name: { [Op.like]: `%${reqQuery.name}%` } }),
            ...(reqQuery.creationDate && {
                creation_date: {
                    [Op.gte]: new Date(reqQuery.creationDate).setHours(
                        0,
                        0,
                        0,
                        0
                    ),
                    [Op.lt]: date.setDate(date.getDate() + 1),
                },
            }),
            ...(reqQuery.minPrice &&
                reqQuery.maxPrice && {
                    price: {
                        [Op.between]: [reqQuery.minPrice, reqQuery.maxPrice],
                    },
                }),
            ...(reqQuery.minPrice &&
                !reqQuery.maxPrice && {
                    price: { [Op.gte]: [reqQuery.minPrice] },
                }),
            ...(reqQuery.maxPrice &&
                !reqQuery.minPrice && {
                    price: { [Op.lte]: [reqQuery.maxPrice] },
                }),
        },
        include: [
            {
                model: Category,
                ...(reqQuery.categoryName && {
                    where: {
                        name: { [Op.like]: `%${reqQuery.categoryName}%` },
                    },
                }),
            },
            {
                model: Supplier,
                ...(reqQuery.supplierName && {
                    where: {
                        name: { [Op.like]: `%${reqQuery.supplierName}%` },
                    },
                }),
            },
        ],
        limit: pageSize,
        offset: (page - 1) * pageSize,
    });
};
