import {
    addSupplier,
    getAllSuppliers,
    getSupplierByEmail,
    getSupplierByName,
    getSupplierByPhone,
} from "../services/suppliers.service.js";

const getSuppliers = async (req, res) => {
    try {
        return res.status(200).send(await getAllSuppliers(req.query));
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};
const createSupplier = async (req, res) => {
    try {
        if (
            (await getSupplierByEmail(req.body.contact_email)) ||
            (await getSupplierByName(req.body.name)) ||
            (await getSupplierByPhone(req.body.phone_number))
        ) {
            return res.status(409).send("Duplicate found");
        }
        await addSupplier(req.body);

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
