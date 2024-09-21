import {
    addSupplier,
    getAllSuppliers,
    getSupplierByEmail,
    getSupplierByName,
    getSupplierByPhone,
    getSupplierById,
    updateSupplierById,
    uniqueSupplierCheck,
} from "../services/suppliers.service.js";

export const getSuppliers = async (req, res) => {
    try {
        return res.status(200).send(await getAllSuppliers(req.query));
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};
export const createSupplier = async (req, res) => {
    try {
        if (
            (await getSupplierByEmail(req.body.contact_email)) ||
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

export const updateSupplier = async (req, res) => {
    try {
        if (
            Object.keys(req.body).length === 0 ||
            !(await getSupplierById(req.params.id))
        ) {
            return res.status(400).send("Invalid data provided");
        }
        if ((await uniqueSupplierCheck(req.body)).length > 0) {
            return res.status(409).send("Duplicate found");
        }
        await updateSupplierById(req.params.id, req.body);
        res.status(200).json({
            status: "success",
            message: "Supplier updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error: "Putting failed",
        });
    }
};
