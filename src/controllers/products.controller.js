import {
    addProduct,
    getAllProducts,
    getProductById,
    updateProductById,
} from "../services/products.service.js";
import { getSupplierById } from "../services/suppliers.service.js";
import { getCategoryById } from "../services/categories.service.js";

const getProducts = async (req, res) => {
    try {
        res.status(200).send(await getAllProducts(req.query.filter));
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};
const getProduct = async (req, res) => {
    try {
        return res.status(200).send(await getProductById(req.params.id));
    } catch (error) {
        res.status(404).json({
            status: "error",
            error: "Not found",
        });
    }
};
const createProduct = async (req, res) => {
    try {
        if (!(await getSupplierById(req.body.supplier_id))) {
            return res.status(400).send("Invalid supplier_id");
        }
        if (!(await getCategoryById(req.body.category_id))) {
            return res.status(400).send("Invalid category_id");
        }
        await addProduct(req.body);

        return res.status(201).json({
            status: "success",
            message: "Product created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Creation failed",
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        if (
            Object.keys(req.body).length === 0 ||
            !(await getProductById(req.params.id)) ||
            !(await getSupplierById(req.body.supplier_id)) ||
            !(await getCategoryById(req.body.category_id))
        ) {
            return res.status(400).send("Invalid data provided");
        }
        await updateProductById(req.params.id, req.body);
        res.status(200).json({
            status: "success",
            message: "Product updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Putting failed",
        });
    }
};

export default { getProducts, getProduct, createProduct, updateProduct };
