import Category from "../models/Category.js";

export const getCategoryById = async (id) => {
    return await Category.findByPk(id);
};

export const getCategory = async (name) => {
    return await Category.findOne({
        where: {
            name: name,
        },
    });
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
