import Product from "../models/Product.js";

export const getAllProducts = async (reqQuery) => {
    const order = reqQuery.filter ? [[reqQuery.filter + "_id"]] : undefined;
    const page = parseInt(reqQuery.page);
    const pageSize = parseInt(reqQuery.pageSize);

    return await Product.findAll({
        order,
        limit: pageSize,
        offset: (page - 1) * pageSize,
    });
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
