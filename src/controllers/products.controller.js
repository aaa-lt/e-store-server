import Product from "../models/Product.js";

const getProducts = async (req, res) => {
    try {
        const filter = req.query.filter;
        if (filter === "category" || filter === "supplier") {
            const products = await Product.findAll({
                order: [[filter + "_id"]],
            });
            return res.status(200).send(products);
        }
        const products = await Product.findAll();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};
const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { id: req.params.id },
        });
        if (product) {
            return res.status(200).send(product);
        }
        return res.status(404).send("Not found");
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};
const createProduct = async (req, res) => {
    try {
        const { name, description, quantity, price, category_id, supplier_id } =
            req.body;
        await Product.create({
            name: name,
            description: description,
            quantity: quantity,
            price: price,
            category_id: category_id,
            supplier_id: supplier_id,
        });
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
        const updates = {};

        const fields = [
            "name",
            "description",
            "quantity",
            "price",
            "category_id",
            "supplier_id",
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const product = await Product.findByPk(req.params.id);

        if (product) {
            await product.update(updates);

            return res.status(200).json({
                status: "success",
                message: "Product updated successfully",
            });
        }

        return res.status(400).json({
            status: "error",
            message: "Invalid ID",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Putting failed",
        });
    }
};

export default { getProducts, getProduct, createProduct, updateProduct };
