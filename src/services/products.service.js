import { Op } from "sequelize";
import Product from "../models/product.js";
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

    const fromDate = reqQuery.fromDate
        ? new Date(reqQuery.fromDate)
        : undefined;
    const toDate = reqQuery.toDate
        ? new Date(reqQuery.toDate).setHours(23, 59, 59, 999)
        : undefined;

    const filterConditions = {
        ...(reqQuery.name && { name: { [Op.like]: `%${reqQuery.name}%` } }),
        ...(reqQuery.minPrice || reqQuery.maxPrice
            ? {
                  price: {
                      ...(reqQuery.minPrice && { [Op.gte]: reqQuery.minPrice }),
                      ...(reqQuery.maxPrice && { [Op.lte]: reqQuery.maxPrice }),
                  },
              }
            : {}),
        ...((fromDate || toDate) && {
            creation_date: {
                ...(fromDate && { [Op.gte]: fromDate }),
                ...(toDate && { [Op.lte]: toDate }),
            },
        }),
    };

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
    });

    const meta = metaCalc(count, reqQuery.page, reqQuery.limit);

    const products = await Product.findAll({
        where: filterConditions,
        attributes: [
            "id",
            "name",
            "description",
            "price",
            "quantity",
            "image_url",
        ],
        order: order.length > 0 ? order : undefined,
        limit: meta.per_page,
        offset: (meta.current_page - 1) * meta.per_page,
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
    return await Product.destroy({ where: { id: id } });
};
