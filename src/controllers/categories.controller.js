import {
    createCategoryService,
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    updateCategoryById,
} from "../services/categories.service.js";

export const getCategories = async (req, res) => {
    try {
        return res.status(200).send(await getAllCategories());
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};

export const createCategory = async (req, res) => {
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

export const updateCategory = async (req, res) => {
    try {
        if (
            Object.keys(req.body).length === 0 ||
            !(await getCategoryById(req.params.id))
        ) {
            return res.status(400).send("Invalid data provided");
        }
        if (req.body.name) {
            if (await getCategoryByName(req.body.name)) {
                return res.status(409).send("Duplicate found");
            }
        }
        await updateCategoryById(req.params.id, req.body);
        res.status(200).json({
            status: "success",
            message: "Category updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error: "Putting failed",
        });
    }
};
