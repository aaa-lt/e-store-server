import Supplier from "../models/Supplier.js";

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        return res.status(200).send(suppliers);
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};
const createSupplier = async (req, res) => {
    try {
        const { name, contact_email, phone_number } = req.body;
        const existingName = await Supplier.findOne({
            where: { name: name },
        });

        if (existingName)
            return res.status(409).json({
                status: "error",
                error: "Supplier with this name is already exists",
            });
        const existingEmail = await Supplier.findOne({
            where: { contact_email: contact_email },
        });

        if (existingEmail)
            return res.status(409).json({
                status: "error",
                error: "Supplier with this email is already exists",
            });

        const existingNumber = await Supplier.findOne({
            where: { phone_number: phone_number },
        });
        if (existingNumber)
            return res.status(409).json({
                status: "error",
                error: "Supplier with this phone is already exists",
            });

        await Supplier.create({
            name: name,
            contact_email: contact_email,
            phone_number: phone_number,
        });
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
