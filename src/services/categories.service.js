import Category from "../models/Category.js";

export const getCategoryById = async (id) => {
    return await Category.findByPk(id);
};
("");
export const getCategoryByName = async (name) => {
    return await Category.findOne({ where: { name: name } });
};

export const getAllCategories = async () => {
    return await Category.findAll();
};

export const createCategoryService = async (reqBody) => {
    await Category.create({
        name: reqBody.name,
        description: reqBody.description,
    });
};

export const updateCategoryById = async (id, reqBody) => {
    const updates = {};

    for (const key in reqBody) {
        if (Object.prototype.hasOwnProperty.call(reqBody, key)) {
            if (reqBody[key] !== undefined) {
                updates[key] = reqBody[key];
            }
        }
    }

    const category = await Category.findByPk(id);
    await category.update(updates);
};
