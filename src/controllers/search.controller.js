import { searchProductsService } from "../services/search.service.js";

const searchProducts = async (req, res) => {
    try {
        const products = await searchProductsService(req.query);

        if (products.length === 0) {
            return res.status(404).send("Not found");
        }

        res.status(200).send(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};

export default searchProducts;
