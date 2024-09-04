import Product from "../models/Product.js";
import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProductById,
} from "../services/products.service.js";
import { manipulateProductDTO } from "../dto/products.dto.js";

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
        console.log(error);
        res.status(404).json({
            status: "error",
            error: "Not found",
        });
    }
};
const createProduct = async (req, res) => {
    try {
        await addProduct(manipulateProductDTO(req.body));

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

// TODO rewrite update query

const updateProduct = async (req, res) => {
    try {
        await updateProductById(req.params.id, manipulateProductDTO(req.body));
        res.status(200).json({
            status: "success",
            message: "Product updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error: "Putting failed",
        });
    }
};

export default { getProducts, getProduct, createProduct, updateProduct };
