import { Op } from "sequelize";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";
import { metaCalc } from "../utils/pagination.utility.js";

export const getAllProducts = async (reqQuery) => {
    let order = [];
    if (reqQuery.sortBy) {
        order = [
            [
                reqQuery.sortBy.replace("-", ""),
                reqQuery.sortBy.startsWith("-") ? "DESC" : "ASC",
            ],
        ];
    }
    // const date = new Date(reqQuery.creationDate);
    // date.setHours(0, 0, 0, 0);

    const filterConditions = {
        ...(reqQuery.name && { name: { [Op.like]: `%${reqQuery.name}%` } }),
        ...(reqQuery.creationDate && {
            creation_date: {
                [Op.gte]: new Date(reqQuery.creationDate).setHours(0, 0, 0, 0),
                [Op.lt]: new Date(reqQuery.creationDate).setDate(
                    date.getDate() + 1
                ),
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
    };

    const includeArray = [
        {
            model: Category,
            ...(reqQuery.categoryName && {
                where: {
                    name: { [Op.like]: `%${reqQuery.categoryName}%` },
                },
            }),
            attributes: ["id", "name"],
        },
        {
            model: Supplier,
            ...(reqQuery.supplierName && {
                where: {
                    name: { [Op.like]: `%${reqQuery.supplierName}%` },
                },
            }),
            attributes: ["id", "name"],
        },
    ];

    const count = await Product.count({
        where: filterConditions,
        ...(reqQuery.categoryName &&
            reqQuery.supplierName && {
                include: includeArray,
            }),
        ...(reqQuery.categoryName &&
            !reqQuery.supplierName && {
                include: includeArray[0],
            }),
        ...(reqQuery.supplierName &&
            !reqQuery.categoryName && {
                include: includeArray[1],
            }),
        distinct: true,
        logging: console.log,
    });

    const meta = metaCalc(count, reqQuery.page, reqQuery.limit);

    const products = await Product.findAll({
        where: filterConditions,
        include: includeArray,
        attributes: ["id", "name", "description", "price", "quantity"],
        order: order.length > 0 ? order : undefined,
        limit: meta.per_page,
        offset: (meta.current_page - 1) * meta.per_page,
        logging: console.log,
    });

    return {
        meta: meta,
        items: products,
    };
};

export const getProductById = async (id) => {
    return await Product.findOne({
        where: { id: id },
    });
};

export const addProduct = async (product) => {
    await Product.create({
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        category_id: product.category_id,
        supplier_id: product.supplier_id,
    });
};

export const updateProductById = async (id, reqBody) => {
    const updates = {};

    for (const key in reqBody) {
        if (Object.prototype.hasOwnProperty.call(reqBody, key)) {
            if (reqBody[key] !== undefined) {
                updates[key] = reqBody[key];
            }
        }
    }

    const product = await Product.findByPk(id);
    await product.update(updates);
};

export const deleteProductById = async (id) => {
    await Product.destroy({ where: { id: id } });
};
