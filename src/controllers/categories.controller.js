import {
    getAllCategories,
    createCategoryService,
} from "../services/categories.service.js";

const getCategories = async (req, res) => {
    try {
        return res.status(200).send(await getAllCategories());
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};

const createCategory = async (req, res) => {
    try {
        await createCategoryService(req.body);
        return res.status(201).json({
            status: "success",
            message: "Category created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Creation failed",
        });
    }
};

export default { getCategories, createCategory };
