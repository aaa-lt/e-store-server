import Category from "../models/Category.js";
import uniqueUtility from "../utils/unique.js";

const getCategories = async (req, res) => {
    try {
        return res.status(200).send(await Category.findAll());
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            error: "Failed to get information",
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (await uniqueUtility(Category, "name", name))
            return res.status(409).json({
                status: "failed",
                error: "Category with this name is already exists",
            });
        await Category.create({
            name: name,
            description: description,
        });
        return res.status(201).json({
            status: "success",
            message: "Category created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            error: "Creation failed",
        });
    }
};

export default { getCategories, createCategory };
