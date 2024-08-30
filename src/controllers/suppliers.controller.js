import { supplierDTO } from "../dto/suppliers.dto.js";
import Supplier from "../models/Supplier.js";
import { addSupplier, getAllSuppliers } from "../services/suppliers.service.js";

const getSuppliers = async (req, res) => {
    try {
        return res.status(200).send(await getAllSuppliers());
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};
const createSupplier = async (req, res) => {
    try {
        addSupplier(supplierDTO(req.body));

        return res.status(201).json({
            status: "success",
            message: "Supplier created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Creation failed",
        });
    }
};

export default { getSuppliers, createSupplier };
