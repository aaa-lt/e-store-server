import Supplier from "../models/Supplier.js";
import { supplierDTO } from "../dto/suppliers.dto.js";

export const getSupplierByName = async (name) => {
    const supplier = await Supplier.findOne({
        where: {
            name: name,
        },
    });
    if (!supplier) {
        throw new Error("Supplier not found");
    }
    return supplierDTO(supplier);
};

export const getSupplierByEmail = async (email) => {
    const supplier = await Supplier.findOne({
        where: {
            contact_email: email,
        },
    });
    if (!supplier) {
        throw new Error("Supplier not found");
    }
    return supplierDTO(supplier);
};

export const getSupplierByPhone = async (phone) => {
    const supplier = await Supplier.findOne({
        where: {
            phone_number: phone,
        },
    });
    if (!supplier) {
        throw new Error("Supplier not found");
    }
    return supplierDTO(supplier);
};

export const getAllSuppliers = async () => {
    return await Supplier.findAll();
};

export const addSupplier = async (supplier) => {
    await Supplier.create({
        name: supplier.name,
        contact_email: supplier.contact_email,
        phone_number: supplier.phone_number,
    });
};
