import Category from "../models/Category.js";
import { categoryDTO } from "../dto/categories.dto.js";

export const getCategoryById = async (id) => {
    const category = await Category.findByPk(id);
    if (!category) {
        throw new Error("Category not found");
    }
    return categoryDTO(category);
};

export const getCategory = async (name) => {
    const category = await Category.findOne({
        where: {
            name: name,
        },
    });
    if (!category) {
        throw new Error("Category not found");
    }
    return categoryDTO(category);
};

export const getAllCategories = async () => {
    return await Category.findAll();
};

export const addCategory = async (category) => {
    await Category.create({
        name: category.name,
        description: category.description,
    });
};
